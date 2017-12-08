ts=`date +%s`
versionLabel="cordonblue_v0.0.1.$TRAVIS_BUILD_NUMBER"
fileName="$versionLabel.zip"
zip -r $fileName *.js *.json public/ routes/ views/
S3_KEY="$S3_KEY/$fileName"
# Copy the app to S3
aws s3 cp $fileName "s3://$S3_BUCKET/$S3_KEY"

# Create a new version in eb
echo "Creating ElasticBeanstalk Application Version ..."
aws elasticbeanstalk create-application-version \
  --application-name $EB_APP_NAME \
  --version-label "$versionLabel" \
  --description "$versionLabel-$ts" \
  --source-bundle S3Bucket="$S3_BUCKET",S3Key="$S3_KEY" --auto-create-application

# Update to that version
echo "Updating ElasticBeanstalk Application Version ..."
aws elasticbeanstalk update-environment \
  --application-name $EB_APP_NAME \
  --environment-name $EB_APP_ENV \
  --version-label "$versionLabel"

echo "Done! Deployed version $versionLabel"
