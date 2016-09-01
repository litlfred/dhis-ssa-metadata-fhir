
var MetadataFHIR = function(dhisScriptContext) {
    Metadata.call(this, dhisContext);
}
MetadataFHIR.prototype = Metadata.prototype;

MetadataFHIR.prototype.toValueSet = function(metadata,name,subset) {
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



MetadataFHIR.prototype.identifiableObjectToToCodeSystem = function(objects,id,name) {
    if (! Array.isArray(objects)) {
	throw new ErrorProcessing("Did not get data elements ");
    } 
    var contents = [];
    var dates = [];
    objects.forEach( function(object) {
	var concept =  {
	    "code" : object.id,
	    "display" : object.displayName
	};
	concepts.push(concept);
	dates.push(new Date(object.lastUpdated));
    });
    var lastUpdated =new Date(Math.max.apply(null,dates));
    var base_url  = this.systemInfo.getData('json').contextPath;
    if (!base_url) {
	base_url = 'http://locahost:8080'
    }
    var appName = this.dhisScriptContext.appName;
    var url  = base_url+ "/fhir/dstu2/" + appName  + "/CodeSystem/" + id;
    var valueset = {
	'resourceType' : "Code System",
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

    return valueset;

}
