/**
 * @owner Johan B�cklin (jbi)
 */ 
define(["qlik"], function(qlik) {
	var definition = {
        type: "items",
        component: "accordion",
        items: {			
			apps: {
					ref: "apps",
					label: "Apps",
					type: "string",
					component: "dropdown",
					options: function() {
						return getApps().then((apps) => {
							return apps;							
						})	
						function getApps(){return new Promise(function(resolve, reject) {
							qlik.getAppList(function(jbiList){
								var apps = [{
									value: "",
									label: "No app chosen"
								}].concat(jbiList.map(function(jbiInfo) {
									return {
										value: jbiInfo.qDocId,
										label: jbiInfo.qDocName
									};
								}))
								resolve(apps);
							})					
						})
						}
					}
				},
            settings: {
                uses: "settings"
            }
        }
    };
    return definition;
});