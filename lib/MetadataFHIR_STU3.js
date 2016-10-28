
var MetadataFHIR_STU3 = function(dhisScriptContext) {
    Metadata.call(this, dhisScriptContext);
}
MetadataFHIR_STU3.prototype = Metadata.prototype;

MetadataFHIR_STU3.prototype.toValueSet = function(metadata,name,subset) {
    this.dhisScriptContext.logInfo("Creating valueset (" + name + ")");
    var id = metadata.id;
    var concepts = [];
    if (Array.isArray(metadata[subset])) {
	metadata[subset].forEach( function(e) {
	    var concept =  {
		"code" : e.id,
	    };
	});
	concepts.push(concept);
    }
    var lastUpdated =new Date(metadata.lastUpdated); 
    var ContextUtils = Java.type("org.hisp.dhis.webapi.utils.ContextUtils");
    var base_url =  ContextUtils.getContextPath(this.dhisScriptContext.httpRequest) +  this.dhisScriptContext.httpRequest.getServletPath() ;
    if (!base_url) {
	var appContext = dhisScriptContext.getApplicationContext();
	var ContextUtils = this.appContext.getBean("org.hisp.dhis.webapi.utils.ContextUtils");
	base_url = ContextUtils.getContextPath(this.dhisScriptContext.httpRequest)
	log.info("Using BASEURL = " + base_url);
    }
    if (!base_url) {
	base_url = 'http://locahost:8080/'
    }
    var appKey = this.dhisScriptContext.appKey;
    var url  = base_url + "/fhir/"  + appKey + "/stu3/ValueSet/" + name + ":" + id;
    var cs_url  = base_url + "/fhir/" + appKey + "/stu3/ValueSet/" + subset;
    var valueset = {
	'resourceType' : 'ValueSet',
	"id" : name + ":" + metadata.id,
	"meta" : { 
	    "lastUpdated" : lastUpdated.toJSON()
	},
	"url": url,
	"version": lastUpdated.toJSON(),
	"name": metadata.displayName,
	"status": "draft",
	"experimental": false,
	"publisher": "DHIS2 @ " + url,
	"date" : lastUpdated.toJSON(),
	"description": "Value set for DHIS2 " + name + ":" + metadata.displayName + " from " + base_url,
	"codeSystem": {
	    "system": cs_url,
	    "concept": concepts
    }
    };
    this.dhisScriptContext.logInfo("Value created is\n" + JSON.stringify(valueset, null, '\t'));
    return valueset;

};



MetadataFHIR_STU3.prototype.identifiableObjectToCodeSystem = function(objects,id,name) {
    this.dhisScriptContext.logInfo("\n**********\n**********\n**********\n**********\n**********\nCreating code system (" + name + ") with id " + id);
    this.dhisScriptContext.logInfo(objects);
    if (! Array.isArray(objects)) {
	objects = [];
    } 
    var concepts = [];
    var dates = [ new Date("1970-01-01T00:00:00Z")];
    this.dhisScriptContext.logInfo(JSON.stringify(objects,null,'\t'));
    var ContextUtils = Java.type("org.hisp.dhis.webapi.utils.ContextUtils");
    var base_url =  ContextUtils.getContextPath(this.dhisScriptContext.httpRequest) +  this.dhisScriptContext.httpRequest.getServletPath() ;
    var appKey = this.dhisScriptContext.appKey;
    var resource_url  = base_url+ "/fhir/" + appKey + "/stu3/CodeSystem";
    var url  = resource_url  + "/" + id;
    objects.forEach( function(object) {
	var concept =  {
	    "code" : object.id,
	    "display" : object.name
	};
	if (concept.lastUpdated) {
	    concept.meta = {
		'lastUpdated':concept.lastUpdated,
		
	    }
	}
	concept.property = [];
	properties = ["code","aggregationType","domainType","valueType"]; //should handle this better
	properties.forEach( 
	    function(property) {
		if (object[property]) {
		    concept.property.push(
			{
			    'code' : property,
			    'valueCode': object[property]
			}
		    );
		}}
	);
	concepts.push(concept);
	this.dhisScriptContext.logInfo(object.lastUpdated);
	dates.push(new Date(object.lastUpdated));
    });
    var lastUpdated =new Date(Math.max.apply(null,dates));
    this.dhisScriptContext.logInfo(this.dhisScriptContext);
    this.dhisScriptContext.logInfo(lastUpdated);
    var codesystem = {
	'resourceType' : "CodeSystem",
	"id" : id,
	"meta" : { 
	    "lastUpdated" : lastUpdated.toJSON()
	},
	"url": url,
	"version": lastUpdated.toJSON(),
	"name": name,
	"status": "draft",
	"experimental": false,
	"publisher": "DHIS2 @ " + url,
	"date": lastUpdated.toJSON(),
	"description": "Code system for DHIS2 " + name + " from " + url,
	"concept": concepts
    };
    this.dhisScriptContext.logInfo("Value created is\n" + JSON.stringify(codesystem, null, '\t'));

    return codesystem;

}
