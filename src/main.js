/*
 ________________________________________________
(                 URL Validator                ()
\-----------------------------------------------\
|                                               |
|   Copyright 2024 ag-sanjjeev                  |
|                                               |
|-----------------------------------------------|
|   The source code is licensed under           |
|   MIT-style License.                          |
|                                               |
|-----------------------------------------------|
|                                               |
|   The usage, permission and condition         |
|   are applicable to this source code          |
|   as per license.                             |
|                                               |
|-----------------------------------------------|
|                                               |
|   That can be found in LICENSE file           |
|   or at https://opensource.org/licenses/MIT.  |
(_______________________________________________(

*/

/*============================ 
				Global Constants
==============================*/
const form = document.getElementById('url-validator-form');

/*============================ 
			URL Validator Class
==============================*/
class URLValidator {
	constructor(url) {
		if (url == '' || url == undefined || url == null) {
			throw new Error('URL should not be an empty');
		}
		this.url = url.trim(); // remove any whitespace	
		this.urlObject = null;

		// allowed protocols
		this.protocols = {
			'http:' : {
					'secure' : false,
					'message' : 'http is unsafe when submit form with your data'
			},
			'https:' : {
					'secure': true,
					'message' : 'https is safe when submit form with your data'
			},
			'ftp:' : {
					'secure': false,
					'message': 'unsafe file transfer protocol'
			}
		};

		// properties
		this.isUnknownProtocol = false; // used for url without protocol
	}

	getUrlCategory() {
		if (this.isIPAddress()) {
			return this.urlCategory;
		}

		if (this.isActualURL()) {
			return this.urlCategory;
		}

		this.urlCategory = 'invalid';
		return this.urlCategory;
	}

	getURLProtocol(url) {
		let protocol = null;
		for (const key in this.protocols) {
			if (this.protocols.hasOwnProperty(key) && url.startsWith(key)) {
				protocol = key;
			}
		}

		return protocol;		
	}

	getURLProperties(url) {
		let result = null;
		let urlObject = null;
		if (this.urlCategory !== 'URL') {
			return result;
		}
		urlObject = new URL(url);
		result = {
      type: 'URL',
      protocol: urlObject.protocol,	      	     
      host: urlObject.host,
      port: urlObject.port,
      pathname: urlObject.pathname,
      search: urlObject.search,
      searchParams: urlObject.searchParams,
      URLSearchParams: urlObject.URLSearchParams,
      hash: urlObject.hash,
      username: urlObject.username,
      password: urlObject.password
	  };

	  return result;
	}

	getReport() {
		// Get URL category before proceed with report generation
		this.getUrlCategory();
		this.report = {
			'overview' : {},
			'protocol' : {},
			'domain' : {},
			'urlparameters' : {}
		};

		let overviewObject = {
			'status' : null,
			'message' : null
		};
		let protocolObject = {
			'status' : null,
			'message' : null
		};
		let domainObject = {
			'status' : null,
			'message' : null
		};
		let urlParametersObject = {
			'status' : null,
			'message' : null
		};

		// Report for invalid or unknown URL
		if (this.urlCategory == 'invalid') {
			let defaultMessage = 'Not applicable';
			let domainMessage = this.prepareCharacterMessage(this.urlCategory, 'domain', this.url);
			overviewObject.status = 'danger';
			overviewObject.message = 'Given URL is invalid or unknown type. Proceed with this will be dangerous.';
			protocolObject.status = 'danger';
			protocolObject.message = defaultMessage;
			domainObject.status = 'danger';
			domainObject.message = domainMessage;
			urlParametersObject.status = 'danger';
			urlParametersObject.message = defaultMessage;			
		}

		// Report for IPv4 and IPv6
		if (this.urlCategory == 'IPv4' || this.urlCategory == 'IPv6') {
			let protocol = null;
			let host = null;
			let port = null;
			let pathname = null;
			let search = null;
			let hash = null;
			let urlParameters = null;
			let defaultMessage = 'Not applicable';
						
			if (this.urlObject == null) {
				host = this.url;
			} else {
				protocol = this.urlObject.protocol;
				host = this.urlObject.host;
				port = this.urlObject.port;
				pathname = this.urlObject.pathname;
				search = this.urlObject.search;
				hash = this.urlObject.hash;

				urlParameters = (pathname == null) ? '' : pathname;
				urlParameters += (search == null) ? '' : search;
				urlParameters += (hash == null) ? '' : hash;
				urlParameters = (urlParameters.trim().length > 0) ? urlParameters : null;
			}

			let protocolMessage = (protocol == null) ? defaultMessage : this.prepareCharacterMessage(this.urlCategory, 'protocol', protocol);
			if (protocol !== null) {
				if (this.protocols.hasOwnProperty(protocol)) {
					protocolObject.status = (protocolMessage.querySelectorAll('div span.danger').length > 0) ? 'danger' : (protocolMessage.querySelectorAll('div span.warning').length > 0) ? 'warning' : 'success'; 
					let div = document.createElement('div');
					div.innerHTML = this.protocols[protocol].message;
					protocolMessage.appendChild(div);
					if (this.protocols[protocol].secure) {
						protocolObject.status = (protocolObject.status == 'danger') ? 'danger' : 'success';
					} else {
						protocolObject.status = (protocolObject.status == 'danger') ? 'danger' : 'warning';
					}
				}
			} else {
				protocolObject.status = 'danger';
			}			
			protocolObject.message = protocolMessage;

			let domainMessage = this.prepareCharacterMessage(this.urlCategory, 'domain', host);
			domainObject.status = (domainMessage.querySelectorAll('div span.danger').length > 0) ? 'danger' : (domainMessage.querySelectorAll('div span.warning').length > 0) ? 'warning' : 'success'; 
			domainObject.message = domainMessage;

			let urlParametersMessage = (urlParameters == null) ? defaultMessage : this.prepareCharacterMessage(this.urlCategory, 'parameters', urlParameters);
			if (urlParameters !== null) {				
					urlParametersObject.status = (urlParametersMessage.querySelectorAll('div span.danger').length > 0) ? 'danger' : (urlParametersMessage.querySelectorAll('div span.warning').length > 0) ? 'warning' : 'success';
			} else {
					urlParametersObject.status = 'danger';
			}
			urlParametersObject.message = urlParametersMessage;			

			if (domainObject.status == 'danger' || protocolObject.status == 'danger' || urlParametersObject.status == 'danger') {
				overviewObject.status = 'danger';
			} else if (domainObject.status == 'warning' || protocolObject.status == 'warning' || urlParametersObject.status == 'warning') {
				overviewObject.status = 'warning';
			} else {
				overviewObject.status = 'success';
			}
			overviewObject.message = 'Given URL is IP address. Proceed with this will be dangerous.';				
		}

		// Report for URL with unknown protocol
		if (this.urlCategory == 'URL') {
			let protocol = null;
			let host = null;
			let port = null;
			let pathname = null;
			let search = null;
			let hash = null;
			let urlParameters = null;
			let defaultMessage = 'Not applicable';
						
			if (this.urlObject == null) {
				host = this.url;
			} else {
				protocol = (this.isUnknownProtocol) ? null : this.urlObject.protocol;
				host = this.urlObject.host;
				port = this.urlObject.port;
				pathname = this.urlObject.pathname;
				search = this.urlObject.search;
				hash = this.urlObject.hash;

				urlParameters = (pathname == null) ? '' : pathname;
				urlParameters += (search == null) ? '' : search;
				urlParameters += (hash == null) ? '' : hash;
				urlParameters = (urlParameters.trim().length > 0) ? urlParameters : null;
			}

			let protocolMessage = (protocol == null) ? defaultMessage : this.prepareCharacterMessage(this.urlCategory, 'protocol', protocol);
			if (protocol !== null) {
				if (this.protocols.hasOwnProperty(protocol)) {
					protocolObject.status = (protocolMessage.querySelectorAll('div span.danger').length > 0) ? 'danger' : (protocolMessage.querySelectorAll('div span.warning').length > 0) ? 'warning' : 'success'; 
					let div = document.createElement('div');
					div.innerHTML = this.protocols[protocol].message;
					protocolMessage.appendChild(div);
					if (this.protocols[protocol].secure) {
						protocolObject.status = (protocolObject.status == 'danger') ? 'danger' : 'success';
					} else {
						protocolObject.status = (protocolObject.status == 'danger') ? 'danger' : 'warning';
					}
				}
			} else {
				protocolObject.status = 'danger';
				protocolMessage = 'Unknown protocol is unsafe.';
			}			
			protocolObject.message = protocolMessage;

			let domainMessage = this.prepareCharacterMessage(this.urlCategory, 'domain', host);
			domainObject.status = (domainMessage.querySelectorAll('div span.danger').length > 0) ? 'danger' : (domainMessage.querySelectorAll('div span.warning').length > 0) ? 'warning' : 'success'; 
			domainObject.message = domainMessage;

			let urlParametersMessage = (urlParameters == null) ? defaultMessage : this.prepareCharacterMessage(this.urlCategory, 'parameters', urlParameters);
			if (urlParameters !== null) {				
					urlParametersObject.status = (urlParametersMessage.querySelectorAll('div span.danger').length > 0) ? 'danger' : (urlParametersMessage.querySelectorAll('div span.warning').length > 0) ? 'warning' : 'success';
			} else {
					urlParametersObject.status = 'danger';
			}
			urlParametersObject.message = urlParametersMessage;			
			
			if (domainObject.status == 'danger' || protocolObject.status == 'danger' || urlParametersObject.status == 'danger') {
				overviewObject.status = 'danger';
			} else if (domainObject.status == 'warning' || protocolObject.status == 'warning' || urlParametersObject.status == 'warning') {
				overviewObject.status = 'warning';
			} else {
				overviewObject.status = 'success';
			}

			let overviewMessage = '';
			// Check for the host match with given URL 
			if (this.url.match(host) == null) {
				overviewMessage = 'It might be homoglyph or homograph or IDN URL. Because, the host is not matched with given URL. ';
			}
			overviewMessage += `Protocol is ${protocolObject.status} status, Domain Name is ${domainObject.status} status, URL part is ${urlParametersObject.status} status.`;
			overviewObject.message = overviewMessage;
		}

		this.report['overview'] = overviewObject;
		this.report['protocol'] = protocolObject;
		this.report['domain'] = domainObject;
		this.report['urlparameters'] = urlParametersObject;

		return this.report;
	}

	getCharacterType(character) {
		if (/[a-zA-Z]/.test(character)) {
	    return "alphabet";
	  } else if (/[0-9]/.test(character)) {
	    return "number";
	  } else if (/[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\|\;\'\:\"\,\.\<\>\/\?]/.test(character)) {
	    return "special";
	  } else {
	    return "unknown";
	  }
	}

	getCharacterStatus(urlCategory, urlPart, character, charType) {
		// Invalid URL
		if (urlCategory == 'invalid' && charType == 'alphabet') {
			return 'success';
		}
		if (urlCategory == 'invalid' && charType == 'number') {
			return 'warning';
		}
		if (urlCategory == 'invalid') { // special and unknown
			return 'danger';
		}

		// IPv4
		// Protocol
		if (urlCategory == 'IPv4' && urlPart == 'protocol' && (charType == 'alphabet' || (charType == 'special' && (character == ':' || character == '/')))) {
			return 'success';
		}
		if (urlCategory == 'IPv4' && urlPart == 'protocol' && charType == 'number') {
			return 'warning';
		}
		if (urlCategory == 'IPv4' && urlPart == 'protocol') { // special and unknown
			return 'danger';
		}
		// IPv4
		// Domain
		if (urlCategory == 'IPv4' && urlPart == 'domain' && (charType == 'number' || (charType == 'special' && character == '.'))) {
			return 'success';
		}
		if (urlCategory == 'IPv4' && urlPart == 'domain') { // alphabet, special and unknown
			return 'danger';
		}
		// IPv4
		// Parameters
		if (urlCategory == 'IPv4' && urlPart == 'parameters' && charType == 'alphabet') {
			return 'success';
		}
		if (urlCategory == 'IPv4' && urlPart == 'parameters' && (charType == 'number' || charType == 'special')) {
			return 'warning';
		}
		if (urlCategory == 'IPv4' && urlPart == 'parameters') { // unknown
			return 'danger';
		}

		// IPv6
		if (urlCategory == 'IPv6' && (charType == 'alphabet' || charType == 'number' || (charType == 'special' && character == ':'))) {
			return 'success';
		}
		if (urlCategory == 'IPv6' && charType == 'special') {
			return 'danger';
		}
		if (urlCategory == 'IPv6') { // unknown
			return 'danger';
		}

		// Actual URL
		// Protocol
		if (urlCategory == 'URL' && urlPart == 'protocol' && (charType == 'alphabet' || (charType == 'special' && (character == ':' || character == '/')))) {
			return 'success';
		}
		if (urlCategory == 'URL' && urlPart == 'protocol' && charType == 'number') {
			return 'warning';
		}
		if (urlCategory == 'URL' && urlPart == 'protocol') { // special and unknown
			return 'danger';
		}
		// Actual URL
		// Domain
		if (urlCategory == 'URL' && urlPart == 'domain' && charType == 'alphabet') {
			return 'success';
		}
		if (urlCategory == 'URL' && urlPart == 'domain' && (charType == 'special' && (character == '.' || character == '-'))) {
			return 'success';
		}
		if (urlCategory == 'URL' && urlPart == 'domain' && charType == 'special') {
			return 'warning';
		}
		if (urlCategory == 'URL' && urlPart == 'domain') { // unknown
			return 'danger';
		}
		// Actual URL
		// Parameters
		if (urlCategory == 'URL' && urlPart == 'parameters' && charType == 'alphabet') {
			return 'success';
		}
		if (urlCategory == 'URL' && urlPart == 'parameters' && (charType == 'special' && (character == '/' || character == '?' || character == '&' || character == '='))) {
			return 'success';
		}
		if (urlCategory == 'URL' && urlPart == 'parameters' && (charType == 'number' || charType == 'special')) {
			return 'warning';
		}
		if (urlCategory == 'URL' && urlPart == 'parameters') { // unknown
			return 'danger';
		}
	}

	prepareCharacterMessage(urlCategory, urlPart, text) {
		let message = document.createElement('div');
		message.classList.add('message-container');
		let div = document.createElement('div');
		let charType = null;
		let status = null;
		let characterArray = text.split('');

		for (let character of characterArray) {				
			charType = this.getCharacterType(character);
			status = this.getCharacterStatus(urlCategory, urlPart, character, charType);
			let span = document.createElement('span');
			span.classList.add(status);
			span.innerHTML = character;
			div.appendChild(span);
		}
		message.appendChild(div);
		return message;
	}

	containsClassName(parentElement, className) {
		for (let className of classList) {
			element.classList.contains(className);
			return true;
		}
		for (let child of children) { if(child.classList.contains('danger')) { return true; } else { return false; } }
	}

	isIPAddress() {
		// Check for IPv4 address
		if (this.isIPv4(this.url)) {
			this.urlCategory = 'IPv4';
			return true;
		}

		// Check for IPv6 address
		if (this.isIPv6(this.url)) {
			this.urlCategory = 'IPv6';
			return true;
		}

		return false;
	}

	isActualURL() {
  	let protocol = this.getURLProtocol(this.url);
  	
  	if (protocol === null || protocol === undefined || protocol === '') {
  		console.warn('URL does not has a valid protocol');
  		// missing or unknown protocol for try without protocol in URL class
  		this.isUnknownProtocol = true;
  	}

		if (this.isUnknownProtocol) {
			try {
				this.urlObject = new URL('https://' + this.url);
			} catch (error) {
				this.urlObject = null;
				console.warn(error);
				return false;
			}
		} else {
			// Check for Actual URL
			try {  		
				this.urlObject = new URL(this.url);			 
	  	} catch(error) {
	  		this.urlObject = null;
				this.urlCategory = 'invalid';	
	  		console.warn(error);
	  		return false;
	  	}			
		}
	  			
  	// check for IP from actual URL
  	if (this.isIPv4(this.urlObject.host)) {
			this.urlCategory = 'IPv4';
			return true;
  	}
  	
  	if (this.isIPv6(this.urlObject.host)) {
			this.urlCategory = 'IPv6';
			return true;
  	}

  	if (this.urlObject) {
  		this.urlCategory = 'URL';	
			return true;	
  	}

		this.urlCategory = 'invalid';
		return false;	
	}

	isIPv4(url) {
		// IPv4 Regex	that has 4 octet and may have port number 
  	const octet = '(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?|0)';
    const port = '([0-9]){1,5}';
  	const regex = new RegExp(`^${octet}\\.${octet}\\.${octet}\\.${octet}$`);
    const regexWithPort = new RegExp(`^${octet}\\.${octet}\\.${octet}\\.${octet}\\:${port}$`);
  	
  	return regex.test(url) ? true : regexWithPort.test(url);
	}

	isIPv6(url) {
	  let groups = url.split(':');
	  let groupsLength = groups.length;
	  let isPortNumberExist = false;
	  let portNumber = null;

	  // check for number of double colon occurrence
	  let zeroGroupCount = (url.match(/::/g) || []).length;

	  if (zeroGroupCount > 1) {
	  	return false;
	  } else if (zeroGroupCount === 1) {
	  	groupsLength++;
	  }
	  
	  // Check group count with port number
	  if (groupsLength !== 8 && groupsLength !== 9) {  	
	    return false;
	  }

	  // check port number exist
	  if (zeroGroupCount === 1 && groupsLength === 8) {
	  	isPortNumberExist = true;
	  } else if (groupsLength === 9) {
	  	isPortNumberExist = true;
	  }

	  // extract port number if exist
	  if (isPortNumberExist) {
	  	portNumber = groups.pop();
	  }

	  let doubleColonCount = 0;
	  let nonZeroGroupCount = 0;

	  for (const group of groups) {
	    if (group === '') {
	      if (doubleColonCount > 0) {	  			
	        return false; // Double colon used more than once
	      }
	      doubleColonCount++;
	    } else {
	      nonZeroGroupCount++;
	      for (const char of group) {
	        if (!('0123456789abcdef'.includes(char.toLowerCase()))) {
	          return false; // Invalid character
	        }
	      }
	    }
	  }

	  // Check if non-zero groups are 8 after accounting for double colon
	  let groupCount = nonZeroGroupCount + doubleColonCount;
	  
	  if (zeroGroupCount === 1) {
	  	groupCount++;
	  }

	  if (isPortNumberExist) {
	  	groupCount++;
	  }
	  
	  return (groupCount === 8 || groupCount === 9);
	}
}

/*============================ 
				Event Listeners 
==============================*/

// form submit event
form.addEventListener('submit', function(event) {	
	event.preventDefault();
	event.stopImmediatePropagation();

	let urlInput = form.urlInput.value;
	const obj = new URLValidator(urlInput);	
	let report = obj.getReport();
	
	if (typeof report != 'object') {
		throw new Error('Unexpected error');
		return false;
	}
	
	for (const key in report) {

		if (report.hasOwnProperty(key)) {
			
			const statusClassList = ['success', 'warning', 'danger'];
			for (const className of statusClassList) { 				
				document.getElementById(key).classList.remove(className);
			}

			document.getElementById(key).classList.add(report[key].status);
			
			if (typeof report[key].message === 'string' && report[key].message != null) {
				document.querySelector(`#${key} .message`).innerHTML = report[key].message;
			} else if (typeof report[key].message === 'object' && report[key].message != null) {
				document.querySelector(`#${key} .message`).innerHTML = '';
				document.querySelector(`#${key} .message`).appendChild(report[key].message);			
			} else {
				document.querySelector(`#${key} .message`).innerHTML = '';
			}
		}
	}
});