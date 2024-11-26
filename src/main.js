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
		this.isProtocolMissing = false; // used for url without protocol
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

	isIPAddress() {
		// Check for IPv4 address
		if (this.isIPv4()) {
			this.urlCategory = 'IPv4';
			return true;
		}

		// Check for IPv6 address
		if (this.isIPv6()) {
			this.urlCategory = 'IPv6';
			return true;
		}

		return false;
	}

	isActualURL() {
  	// URL Regex
  	// const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  	let urlObject = false;
  	let protocol = this.getURLProtocol();
  	
  	if (protocol === null || protocol === undefined || protocol === '') {
  		console.warn('URL does not has a valid protocol');
  		// use default https protocol
  		this.isProtocolMissing = true;
  	}

  	try {
  		if (this.isProtocolMissing) {
				urlObject = new URL('https://' + this.url);
  		} else {
				urlObject = new URL(this.url);
			}
  	} catch(error) {
  		console.error(error);
  		return false;
  	}

		// Check for Actual URL
		if (urlObject) {
			this.urlCategory = 'URL';		 	
		}

		return true;
	}

	getURLProtocol() {
		let protocol = null;
		for (const key in this.protocols) {
			if (this.protocols.hasOwnProperty(key) && this.url.startsWith(key)) {
				protocol = key;
			}
		}

		return protocol;		
	}

	isIPv4() {
		// IPv4 Regex	that has 4 octet and may have port number 
  	const octet = '(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?|0)';
    const port = '([0-9]){1,5}';
  	const regex = new RegExp(`^${octet}\\.${octet}\\.${octet}\\.${octet}$`);
    const regexWithPort = new RegExp(`^${octet}\\.${octet}\\.${octet}\\.${octet}\\:${port}$`);
  	
  	return regex.test(this.url) ? true : regexWithPort.test(this.url);
	}

	isIPv6() {
	  let groups = this.url.split(':');
	  let groupsLength = groups.length;
	  let isPortNumberExist = false;
	  let portNumber = null;

	  // check for number of double colon occurrence
	  let zeroGroupCount = (this.url.match(/::/g) || []).length;

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

	getURLProperties() {
		let result = null;
		let urlObject = null;
		if (this.urlCategory !== 'URL') {
			return result;
		}
		urlObject = new URL(this.url);
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
	console.log(obj.getUrlCategory());
});