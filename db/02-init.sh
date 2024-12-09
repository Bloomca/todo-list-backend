#!/bin/bash
set -e

# Wait for MySQL to be ready
until mysql -u"root" -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 1"; do
  echo "Waiting for MySQL to be ready..."
  sleep 1
done

mysql -u"root" -p"$MYSQL_ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS \`myapp_test\`;"

# Copy structure from myapp to myapp_test
mysqldump -u"root" -p"$MYSQL_ROOT_PASSWORD" --no-data myapp | mysql -u"root" -p"$MYSQL_ROOT_PASSWORD" myapp_test

# Grant permissions to the regular user
mysql -u"root" -p"$MYSQL_ROOT_PASSWORD" -e "GRANT ALL PRIVILEGES ON myapp_test.* TO '$MYSQL_USER'@'%';"