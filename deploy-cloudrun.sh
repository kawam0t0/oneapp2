#!/bin/bash

# ===========================================
# Cloud Run デプロイスクリプト
# ===========================================

# 設定
PROJECT_ID="splashbrothers-db1"
REGION="asia-northeast1"
SERVICE_NAME="oneapp"
CLOUD_SQL_INSTANCE="splashbrothers-db1:asia-northeast1:oneapp-db"

# 環境変数（機密情報は別途設定することを推奨）
DB_USER="s.kawamoto"
DB_NAME="square2124"

echo "=========================================="
echo "Cloud Run デプロイを開始します"
echo "=========================================="

# 1. プロジェクトを設定
echo "[1/4] GCPプロジェクトを設定中..."
gcloud config set project $PROJECT_ID

# 2. 必要なAPIを有効化
echo "[2/4] 必要なAPIを有効化中..."
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable sqladmin.googleapis.com

# 3. Cloud Runにデプロイ
echo "[3/4] Cloud Runにデプロイ中..."
gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --add-cloudsql-instances $CLOUD_SQL_INSTANCE \
  --set-env-vars "INSTANCE_UNIX_SOCKET=/cloudsql/$CLOUD_SQL_INSTANCE" \
  --set-env-vars "DB_USER=$DB_USER" \
  --set-env-vars "DB_NAME=$DB_NAME" \
  --set-env-vars "NEXTAUTH_URL=https://your-service-url.run.app" \
  --set-env-vars "NEXTAUTH_SECRET=your-nextauth-secret" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --port 8080

# 4. デプロイ完了
echo "[4/4] デプロイ完了!"
echo ""
echo "=========================================="
echo "次のステップ:"
echo "=========================================="
echo "1. DB_PASSWORDをCloud Runの環境変数に追加してください（シークレット推奨）"
echo "   gcloud run services update $SERVICE_NAME --region $REGION --set-secrets=DB_PASSWORD=db-password:latest"
echo ""
echo "2. Cloud SQLの承認済みネットワークから 0.0.0.0/0 を削除してください"
echo ""
echo "3. サービスURLにアクセスして動作確認してください"
echo "=========================================="
