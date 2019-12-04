export const config = {
  "dev": {
    "username": process.env.UDC_DB_UNAME,
    "password": process.env.UDC_DB_PASS,
    "database": process.env.UDC_DB,
    "host": process.env.UDC_DB_URL,
    "dialect": "postgres",
    "aws_region": process.env.UDC_AWS_REGION,
    "aws_profile": process.env.UDC_AWS_PROFILE,
    "aws_media_bucket": process.env.UDC_AWS_MEDIA_BUCKET,
  },
  "prod": {
    "username": "",
    "password": "",
    "database": "udagram_prod",
    "host": "",
    "dialect": "postgres"
  },
  "jwt": {
    "secret": process.env.JWT_SECRET
  }
}
