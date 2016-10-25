
var MetadataFHIR_STU2 = function(dhisScriptContext) {
    Metadata.call(this, dhisScriptContext);
}
MetadataFHIR_STU2.prototype = Metadata.prototype;

MetadataFHIR_STU2.prototype.toValueSet = function(metadata,name,subset) {
    if (! Array.isArray(objects)) {
	throw new ErrorProcessing("Did not get data elements ");
    } 
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
    var base_url  = this.systemInfo.getData('json').contextPath;
    if (!base_url) {
	base_url = 'http://locahost:8080'
    }
    var appName = this.dhisScriptContext.appName;
    var url  = base_url + "/fhir/dstu2/" + appName + "/ValueSet/" + name + ":" + id;
    var cs  = base_url + "/fhir/dstu2/" + appName + "/ValueSet/" + subset;
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
	"description": "Value set for DHIS2 " + name + ":" + displayName + " from " + base_url,
	"codeSystem": {
	    "system": cs_url,
	    "concept": concepts
    }
    };

    return valueset;

};


