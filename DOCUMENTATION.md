# DOCUMENTATION
This is a documentation for the `URL Validator` project. It consist of different sections to describe different kinds of information about this project.  

## &#9776; Table of Contents
1. [Introduction](#-introduction)
2. [Why it is need](#-why-it-is-need)
3. [What it can](#-what-it-can)
4. [Algorithm](#-algorithm)
5. [How it works](#-how-it-works)
6. [Test and Outputs](#-test-and-outputs)
7. [Warning](#-warning)

## &#9873; Introduction
This documentation gives basic and technical information about the project. See through out documentation for the algorithm, program and other details for better understanding and usage.

First [README](./README.md) when you refer and using the project. 

## &#9873; Why it is need
We are using digital services in our day to day life. Sending and receiving a web link is in common. As much as Cyber Security threats are improving to target the user to take control by them. To prevent from various Cyber Security attacks, The awareness, technology and updates are roaming around us. Due to this gives a panic when using the web link that might be a problem. Eventhough, we are trusted to use familiar and popular sites and their links. The attacks modernized as per people mindset. One of the Cyber Security attack taken against the people who are trust with familiar and popular sites. Attackers serve the URLs or Web Links that look like familiar and popular sites. This kinds of URLs or Web Links are knowns `homoglyph`, `homograph`, `IDN` and `Unicode Domain Name` attack. To clarify before click or open those URLs is needed. 

## &#9873; What it can
- It can check and validate given URL for `homoglyph`, `homograph`, `IDN` and `Unicode Domain Name` URLs.
- It can check basis format check for IPv4, IPv6 and URL that you given.
- It can provide basic information as a report to the user about the given URL.
- This will give instant check feature before proceed with trusted links and URLs. But it is not an complete analysis of remote website.

## &#9873; Algorithm
**Application Algorithm:**
- First, application program started when opened.
- Form submit event listener starts to listen for form submit.
- Once form get submitted, it prevents the form being submitted.
- It gets the `URL Input` from the field.
- If the `URL Input` is an empty then it will gives alert and would not proceed.
- If the `URL Input` is not an empty then it proceed with `URLValidator` class initiation.
- `URL` is sent to the class constructor when class initiation.
- `getReport` method is invoked.
- After getting a report, checking for any errors from the report.
- It will load the all necessary information to the respective sections.  

**getReport Method Algorithm:**
- `getReport` method invokes `getUrlCategory` method.
- Initialize the empty report objects.
- It will check for `urlCategory` property value.
- If it is `invalid` then prepares an report by invoking `prepareCharacterMessage` method.
- If it is `IPv4` or `IPv6` then prepares an report by invoking `prepareCharacterMessage` method for various aspect such as protocol, domain, URL parameters and overview.
- It it is `URL` then follows procedure as same as above.
- Finally, It returns the report object.

**getUrlCategory Method Algorithm:**
- `getUrlCategory` method invokes `isIPAddress` method and `isActualURL` method.
- Based on the response from two methods, this will decide whether a valid address or `Invalid URL`.
- It sets the `urlCategory` property value and returns the value.

**prepareCharacterMessage Method Algorithm:**
- `prepareCharacterMessage` method will create `DOM` elements for each character report.
- It will split text into individual characters array.
- Iterates the characters array for prepare individual character report.
- It will invoke `getCharacterType` method and `getCharacterStatus` method for adding message and status highlight to it.
- Finally, It returns the prepared `DOM` object to where it gets invoked.

**isIPAddress Method Algorithm:**
- `isIPAddress` method invoke `isIPv4` method and `isIPv6` method to check it is a valid `IP` address or not.
- This will set `urlCategory` property.
- It will return the boolean true if it is an `IP` address otherwise false.

**isActualURL Method Algorithm:**
- `isActualURL` method invokes `getURLProtocol` method before get into process.
- If the given URL does not contains valid protocol then it will set `isUnknownProtocol` property as true. That property will be used in `getReport` method.
- It will add protocol manually to check whether it might be an `URL`.
- Eventhough, It said valid then it might be a `IP` address as well. Due to built-in `URL` class of the JavaScript.
- At end of it, compare with regular expression for simple `URL` format confirmation.
- This will set `urlCategory` property.
- Finally, It will set `urlObject` and returns true when it is in a valid `URL` otherwise `null` value and returns false.

**getCharacterType Method Algorithm:**
- `getCharacterType` method checks the type of the given character.
- It uses regular expression to check for an alphabet, number, special character or unknown character.
- It returns the type as a result for the given character.

**getCharacterStatus Method Algorithm:**
- `getCharacterStatus` method checks and return status for a given character.
- It has certain conditions and type to set status to a character.
- It returns status text as `success`, `warning` or `danger`.

**isIPv4 Method Algorithm:**
- `isIPv4` method can perform regular expression test.
- An `IPv4` address has 4 octet and separated by `.` (dot).
- Each octet will ranges from 0 - 255.
- It may has a port number at end of it which is separated by a `:` (colon).
- It returns boolean value either `true` or `false`.

**isIPv6 Method Algorithm:**
- `isIPv6` method can perform various stages of verification without a regular expression.
- To check `IPv6` address has 8 groups and separated by `:` (colon).
- Each group represents the hexadecimal value.
- That ranges from 0 to maximum of 4 digit hexadecimal value.
- It may has zero group and only one consecutive zero group.
- The consecutive zero group may represented by `::` (double colon).  
- It may has a port number at end of it which is separated by a `:` (colon).
- It returns boolean value either `true` or `false`.

**getURLProtocol Method Algorithm:**
- `getURLProtocol` method can get protocol in the given `URL`.
- The `URL` class treats the `URL` without a protocol is in an invalid.
- This will check whether the protocol exist in the `protocols` object.
- And this will check that protocol should starts with given `URL`.
- It returns if the `URL` has a protocol otherwise `null`.

## &#9873; How it works
- First, enter the `IP` or `URL` address to validate.
- Click `Validate URL` button to validate given input address.
- This will check whether it is an empty or not.
- It is not an empty then it starts to validate.
- It takes type of the address given.
- It checks whether the given address is valid or invalid.
- It checks individual characters for any other `homoglyph`, `homograph` or `Unicode Domain` related. 
- It gives report based on validation with three different status.
- The report gives feasibility to the user for cross check between Input address with various parts of the address as `protocol`, `domain`, `URL parameters`.
- From this, any suspicious characters might reveal to stay alert with these address. 

## &#9873; Test and Outputs
**For IP address without protocol:**
- Input address: `127.0.0.1:80`
- Output report:
	- `Overview`: Given URL is IP address. Proceed with this will be dangerous. *(outline red color)*
	- `Protocol`: Not applicable *(outline red color)*
	- `Domain`: `1` `2` `7` `.` `0` `.` `0` `.` `1` `:` `8` `0` *(Highlighted with different colors) (outline red color)*
	- `URL Parameters`: Not applicable *(outline red color)*

**For IP address with protocol and other parameters:**
- Input address: `http://127.0.0.1:80/page?q=search&id=123#div`
- Output report: 
	- `Overview`: Given URL is IP address. Proceed with this will be dangerous. *(outline yellow color)*
	- `Protocol`: `h` `t` `t` `p` `:` *(green color),* HTTP is unsafe and used for transferring data over the web *(outline yellow color)*
	- `Domain`: `1` `2` `7` `.` `0` `.` `0` `.` `1` *(green colors) (outline green color)*
	- `URL Parameters`: `/` `p` `a` `g` `e` `?` `q` `=` `s` `e` `a` `r` `c` `h` `&` `i` `d` `=` `1` `2` `3` `#` `d` `i` `v` *(Highlighted with different colors)* *(outline yellow color)*

**For suspicious URL address with protocol:**
- Input address: `gооgle.com` *(Warning!, don't copy and don't use this URL in your devices)*
- Output report: 
	- `Overview`: It might be homoglyph or homograph or IDN URL. Because, the host is not matched with given URL. Protocol is danger status, Domain Name is danger status, URL parameter is success status. *(outline red color)*
	- `Protocol`: Unknown protocol is unsafe. *(outline red color)*
	- `Domain`: `x` `n` `-` `-` `g` `g` `l` `e` `-` `5` `5` `d` `a` `.` `c` `o` `m` *(Highlighted with different colors) (outline red color)* *(Warning!, don't copy and use this URL in your devices)*
	- `URL Parameters`: `/` *(green colors)* *(outline green color)*

**For actual URL address with protocol:**
- Input address: `https://google.com`
- Output report: 
	- `Overview`: Protocol is success status, Domain Name is success status, URL parameter is success status. *(outline green color)*
	- `Protocol`: `h` `t` `t` `p` `s` `:` *(green color)* HTTPS is safe and encrypted version of HTTP, providing secure communication *(outline green color)*
	- `Domain`: `g` `o` `o` `g` `l` `e` `.` `c` `o` `m` *(green colors) (outline green color)*
	- `URL Parameters`: `/` *(green colors) (outline green color)*

## &#9873; Warning
**Notice: Warning! Don't copy and don't use above URLs and addresses. It is provided here demonstration purpose only. Due to security concerns, we never encourage to try on your devices. By using these above URLs and addresses, Any damage or harm takes place in any nature, we will never responsible for that.**

Here, demonstrating with one popular URL. But it might be possible with any other popular sites URL. Be aware and safe with Links and URLs. Eventhough, it was sent by your trust worthy person. Who may not knew about that.

---
[&#8682; To Top](#documentation)

[&#8962; See README](./README.md)