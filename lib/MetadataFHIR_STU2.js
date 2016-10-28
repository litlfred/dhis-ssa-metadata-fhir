
var MetadataFHIR_STU2 = function(dhisScriptContext) {
    Metadata.call(this, dhisScriptContext);
}
MetadataFHIR_STU2.prototype = Metadata.prototype;

MetadataFHIR_STU2.prototype.toValueSet = function(metadata,name,subset) {
    this.dhisScriptContext.logInfo("Creating value set (" + name + ")");
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
    var appKey = this.dhisScriptContext.appKey;
    var url  = base_url + "/fhir/" + appKey + "/dstu2/ValueSet/" + name + ":" + id;
    var cs_url  = base_url + "/fhir/" + appKey + "/dstu2/ValueSet/" + subset;
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

    return valueset;

};


