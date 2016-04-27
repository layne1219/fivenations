Build
* webpack + processhtml
* tagging: [version]:[build_number] 
* updating the list of tags

Host
* run: docker run -t -p 9000:9000
* sudo docker exec -i -t 665b4a1e17b6 bash #by ID or by name

Release
* Dev
  ** gulp
  ** Automatic pull and build from master
  ** Express web-server to expose the app
  
* Staging 
  ** gulp
  ** Manual pull && build at local envs
  ** Tagging
  ** Push Tags
  ** Checkout tags on Staging
  ** Express web-server to expose the app
