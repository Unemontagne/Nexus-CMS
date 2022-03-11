class NxData {
    categoryInfos(data, catg){
      var nf = {
        list: [],
        deflt: ''
      }
      if(data[catg]){
        nf.list = Object.values(data[catg]).map(it => it.meta_filename)
        var index = 0
        var k = 'default_'+catg.slice(0,-1)

        if(data.settings['_'+catg][k]){
          var searchindex = nf.list.indexOf(data.settings['_'+catg][k])
          if(searchindex !== -1) {
            index = searchindex       
          }
        }
        if(catg === "instances"){
          nf.deflt = data.settings._site.url+"/source/"+nf.list[index]+".json"
          if(data.settings._instances.load_first_thread && data.instances[nf.list[index]].threads && data.instances[nf.list[index]].threads.length){
            nf.deflt += "#" + data.instances[nf.list[index]].threads[0].id
            }
        } else {
          nf.deflt = data.settings._site.url+"/pages/"+nf.list[index]
        }

      }
      return nf
    }
    data() {
      return {
        permalink: "/assets/js/NxData.js"
      };
    }
    render(data) {

      var instances = this.categoryInfos(data, "instances")
      var keys = ['script', 'lang', 'style'];
      var fields = ['script_url', 'default_lang', 'custom_theme_url'];
      for(var i=0; i<keys.length; i++){
        instances[keys[i]] = data.settings._instances[fields[i]]
      }
      var pages = this.categoryInfos(data, "pages")
      if(data.settings._pages.custom_theme_url){
        pages.style = data.settings._pages.custom_theme_url
      } else {
        pages.style = '/assets/css/NxPages.css'
      }
      var nxdata = {
        site: {
          url: data.settings._site.url
        },
        instances: instances,
        pages: pages
      }

      return 'window.NxData = '+JSON.stringify(nxdata)
    }
  }
  
module.exports = NxData;