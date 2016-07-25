define( ["qlik","./properties","css!./jbi-templateOnTheFly.css"],
	function (qlik,properties) {	
	return {
		initialProperties: {			
			version: 1.0,
			showTitles: false
		},
		definition: properties,
		paint : function($element, layout) {
		var jbiAppCopyId,jbiTemplate,config=qlik.currApp(this).model.rpcOptions;
		jbiAppCopyId=layout.qInfo.qId;
		var div='<div class="jbi-template-tab-feedback" style="padding-top:'+$element.height()/3+'px;text-align: center;height:'+$element.height()*0.6+'px; width:'+$element.width()+'px" id="jbi-template-feedback'+jbiAppCopyId+'"></div><div id="'+jbiAppCopyId+'" style="width:100%;height:90%;top:12%;"><div class="jbi-template-tabs">'
		div+='<div class="jbi-template-tab-active" id="jbi-tab0'+jbiAppCopyId+'"><label for="jbi-tab0'+jbiAppCopyId+'">Info</label>'
		if(!layout.apps){
			div+='<div class="jbi-template-tab-content"><div class="jbi-template-tab-header">No app has been chosen</div><div class="jbi-template-tab-list"><ol><li><p><em>In edit mode</em> click on the object to open up the proptery panel on the right-hand side...</p></li><li><p><em>Click "Apps"</em> choose an application ...</p></div><br></div></div></div></div>';
			$element.html(div);
			return;
		}		
		var baseUrl = (config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port: "") + config.prefix;			
		var templateApp = qlik.openApp(layout.apps)
		templateApp.getAppLayout(function(layout){
			jbiTemplate={id:templateApp.id, name:templateApp.model.layout.qTitle, thumbnail:layout.qThumbnail.qUrl, description:layout.description}
			if(!jbiTemplate.description)
				jbiTemplate.description="No description available for this application."
			if(!jbiTemplate.thumbnail)
				jbiTemplate.thumbnail="/img/appoverview/Ic_AppBig.png";
			else
				jbiTemplate.thumbnail=jbiTemplate.thumbnail.substring(1);			
			div+='<div class="jbi-template-tab-content"><img id="jbi-preview-img'+jbiAppCopyId+'" class="jbi-template-tab-preview-img" src="'+baseUrl+jbiTemplate.thumbnail+'">';
			div+='<div class="jbi-template-tab-header">'+jbiTemplate.name+'</div><br><div class="jbi-template-tab-text">'+jbiTemplate.description+'</div></div></div>';
			div+='<div class="jbi-template-tab" id="jbi-tab1'+jbiAppCopyId+'"><a target="_blank" href="'+baseUrl+'sense/app/'+encodeURIComponent(jbiTemplate.id)+'"><label for="jbi-tab1'+jbiAppCopyId+'">Preview</label></a></div>';
			div+='<div class="jbi-template-tab jbi-template-tab-btn" id="jbi-duplicate-btn'+jbiAppCopyId+'"><label class="jbi-template-tab-btn" for="jbi-duplicate-btn-label'+jbiAppCopyId+'">Duplicate to My Work<span class="lui-icon lui-icon lui-icon--import"></span></label></div></div></div>';
			$element.html(div);				
			$("#jbi-duplicate-btn"+jbiAppCopyId).on("click",function(){
				var global = qlik.getGlobal(config);
				global.isPersonalMode(function(pCheck){
				var feedbackBox=$('#jbi-template-feedback'+jbiAppCopyId);
					if(pCheck.qReturn){
						feedbackBox.html("It is not possible to duplicate in the Desktop edition.");
						feedbackBox.show().delay(3000).fadeOut('slow');
					}
					else{
						qlik.callRepository('/qrs/app/'+jbiTemplate.id+'/copy?name='+jbiTemplate.name,'POST','').success(function(reply) {
							feedbackBox.html(reply.name + " has now been duplicated to your 'My Work' area in the hub.");
							feedbackBox.show().delay(3000).fadeOut('slow');
						});
					}
				});		
			});
		});
	}
	};
} );

