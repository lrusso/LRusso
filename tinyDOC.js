var STRING_WELCOME = "";
var STRING_CLICKURL = "HAGA CLICK AQU&Iacute; PARA ABRIR EL LINK";

var LINK_FOUND = false;

var NOTIFICATION_TIMER;

function encodeText(str)
	{
	// FUNCTION FOR ESCAPING SPECIAL CHARACTERS
	var i = str.length;
	var aRet = [];
	while (i--)
		{
		var tempChar = str[i].charCodeAt();
		if (tempChar > 126 || (tempChar==60 || tempChar==62))
			{
			aRet[i] = "&#" + tempChar + ";";
			}
			else
			{
			aRet[i] = str[i];
			}
		}
	return aRet.join("");
	}

function printDocument()
	{
	try
		{
		// CREATING A TEMP IFRAME
		var newIframe = document.createElement("iframe");
		newIframe.width = "0";
		newIframe.height = "0";
		newIframe.src = "about:blank";
		newIframe.className = "tinydoc_frame";

		// ADDING THE IFRAME TO THE DOCUMENT
		document.body.appendChild(newIframe);

		// WRITING THE DOCUMENT CONTENT INTO THE IFRAME
		newIframe.contentWindow.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body style='font-family:Arial;font-size:16px'>" + document.getElementById("tinydoc_textcode").innerHTML + "<\/body><\/html>");
		newIframe.contentWindow.document.close(); //important!
		newIframe.contentWindow.focus(); //IE fix

		// PRINTING THE IFRAME
		newIframe.contentWindow.print();

		// REMOVING THE IFRAME
		document.body.removeChild(newIframe);

		// GETTING THE FOCUS IN THE DOCUMENT
		document.getElementById("tinydoc_textcode").focus();

		// PRENTIVE DELAYED EVENT FOR GETTING FOCUS IN THE DOCUMENT
		setTimeout(function(){document.getElementById("tinydoc_textcode").focus()},200);
		}
		catch(err)
		{
		}

	// GETTING THE FOCUS IN THE DOCUMENT
	document.getElementById("tinydoc_textcode").focus();

	// PRENTIVE DELAYED EVENT FOR GETTING FOCUS IN THE DOCUMENT
	setTimeout(function(){document.getElementById("tinydoc_textcode").focus()},200);
	}

function insertLink()
	{
	try
		{
		// GETTING THE SELECTED TEXT
		var selectedText = window.getSelection().toString();

		// CHECKING THE SELECTED TEXT
		if (selectedText!=null)
			{
			// IF THERE IS A SELECTED TEXT
			if (selectedText.length>0)
				{
				// VALIDATORS FOR KNOWING IF THE SELECTED TEXT IS A HTTP, HTTPS OR MAILTO LINK
				var selectedTextURLChecker1 = selectedText.toLowerCase().indexOf(" ");
				var selectedTextURLChecker2 = selectedText.toLowerCase().indexOf("http://");
				var selectedTextURLChecker3 = selectedText.toLowerCase().indexOf("https://");
				var selectedTextURLChecker4 = checkForEmail(selectedText);

				// VALIDATING THE SELECTED TEXT
				if (selectedTextURLChecker1==-1 && (selectedTextURLChecker2==0 || selectedTextURLChecker3==0 || selectedTextURLChecker4==true))
					{
					// CHECKING IF IT IS A URL OR EMAIL
					if (selectedTextURLChecker4==true)
						{
						// INSERTING THE MAILTO LINK INTO THE DOCUMENT
						formatDoc("insertHTML","<a href='mailto:" + selectedText.toLowerCase() + "' target='_blank'>" + selectedText + "</a>");
						}
						else
						{
						// INSERTING THE URL LINK INTO THE DOCUMENT
						formatDoc("insertHTML","<a href='" + selectedText + "' target='_blank'>" + selectedText + "</a>");
						}
					}
				}
			}

		// FOCUSING THE DOCUMENT
		document.getElementById("tinydoc_textcode").focus();
		setTimeout(function(){document.getElementById("tinydoc_textcode").focus()},200);
		}
		catch(err)
		{
		}
	}

function formatDoc(myCommand, myParameter)
	{
	try
		{
		// EXECUTING COMMAND FOR THE CURRENT SELECTION
		document.execCommand(myCommand, false, myParameter);

		// GETTING THE FOCUS IN THE DOCUMENT
		document.getElementById("tinydoc_textcode").focus();

		// PRENTIVE DELAYED EVENT FOR GETTING FOCUS IN THE DOCUMENT
		setTimeout(function(){document.getElementById("tinydoc_textcode").focus()},200);
		}
		catch(err)
		{
		}
	}

function checkForURL()
	{
	try
		{
		// SETTING THE LINK FOUND VALUE AS FALSE
		LINK_FOUND = false;

		// GETTING THE CURRENT SELECTION
		var selectedNode = window.getSelection().focusNode;

		// GOING THROUGH EVERY NODE
		for (var i=0;i<selectedNode.length;i++)
			{
			try
				{
				// CHECKING IF THE NODE HAS AT LEAST ONE CHILD NODE
				if (selectedNode.firstChild!=null)
					{
					// PERFORMING A RECURSIVE SEARCH FOR EVERY CHILD NODE
					checkForURL_AllDescendants(selectedNode);
					}
					else
					{
					// EXECUTING THE FIND AND SELECT FUNCTION WITHIN THE CURRENT NODE
					checkForURL_Update(selectedNode);
					}
				}
				catch(err)
				{
				}
			}

		// CHECKING IF A LINK WAS FOUND
		if (LINK_FOUND==false)
			{
			// CLEARING THE URL VIEWER
			document.getElementById("tinydoc_urlviewer").innerHTML = "";
			}
		}
		catch(err)
		{
		}
	}

function checkForURL_AllDescendants(latestChildNode)
	{
	try
		{
		// GOING THROUGH EVERY NODE
		for (var i = 0; i < latestChildNode.childNodes.length; i++)
			{
			try
				{
				// CREATING A VARIABLE AND GETTING THE CHILD NODE
				var child = latestChildNode.childNodes[i];

				// CHECKING IF THAT CHILD NODE HAS A CHILD NODE
				if (child.firstChild!=null)
					{
					// IF SO, THIS FUNCTION WILL BE EXECUTED ONE MORE TIME FOR THIS CHILD NODE
					checkForURL_AllDescendants(child);
					}

				// EXECUTING THE CHECK FOR URL FUNCTION WITHIN THE CURRENT NODE
				checkForURL_Update(child);
				}
				catch(err)
				{
				}
			}
		}
		catch(err)
		{
		}
	}

function checkForURL_Update(selectedNode)
	{
	try
		{
		// GETTING THE URL (IF ANY)
		var finalURL = selectedNode.parentNode.href;

		// CHECKING IF THERE IS A VALUE
		if(typeof finalURL !== "undefined")
			{
			// ADDING THE VALUE TO THE URL VIEWER
			document.getElementById("tinydoc_urlviewer").innerHTML = "<a href='" + finalURL + "' target='_blank'>" + STRING_CLICKURL + "</a>";

			// SETTING THE LINK FOUND VALUE AS TRUE
			LINK_FOUND = true;
			}
		}
		catch(err)
		{
		}
	}

function scrollToCaret()
	{
	try
		{
		// SETTING THE SCROLLTOP TO 0
		document.getElementById("tinydoc_textcode").scrollTop = 0;

		// GETTING THE CARET Y-POSITION
		var caretPositionY = getCaretPositionY();

		// GETTING THE DOCUMENT PADDING-TOP
		var containerPaddingTop = document.getElementById("tinydoc_textcode").getBoundingClientRect().top + 10;

		// GETTING THE TARGET POSITION
		var targetPostion = caretPositionY - containerPaddingTop;

		// SETTING THE SCROLL LOCATION
		document.getElementById("tinydoc_textcode").scrollTop = targetPostion;
		}
		catch(err)
		{
		}
	}

function getCaretPositionY()
	{
	// Authors of this function: Nishad Up & Tom
	// https://stackoverflow.com/questions/3972014/get-caret-position-in-contenteditable-div/30993650#30993650

	var y = 0;

	try
		{
		var sel = window.getSelection();
		if(sel.rangeCount)
			{
			var range = sel.getRangeAt(0).cloneRange();
			if(range.getClientRects())
				{
				range.collapse(true);
				var rect = range.getClientRects()[0];
				if(rect)
					{
					y = rect.top;
					}
				}
			}
		}
		catch(err)
		{
		}
	return y;
	}

function getCaretPosition(element)
	{
	// Author of this function: Tim Down
	// https://stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container/4812022#4812022

	var caretOffset = 0;
	try
		{
		var doc = element.ownerDocument || element.document;
		var win = doc.defaultView || doc.parentWindow;
		var sel;

		if (typeof win.getSelection != "undefined")
			{
			sel = win.getSelection();
			if (sel.rangeCount > 0)
				{
				var range = win.getSelection().getRangeAt(0);
				var preCaretRange = range.cloneRange();
				preCaretRange.selectNodeContents(element);
				preCaretRange.setEnd(range.endContainer, range.endOffset);
				caretOffset = preCaretRange.toString().length;
				}
			}
		else if((sel = doc.selection) && sel.type != "Control")
			{
			var textRange = sel.createRange();
			var preCaretTextRange = doc.body.createTextRange();
			preCaretTextRange.moveToElementText(element);
			preCaretTextRange.setEndPoint("EndToEnd", textRange);
			caretOffset = preCaretTextRange.text.length;
			}
		}
		catch(err)
		{
		}
	return caretOffset;
	}

function checkForEmail(email)
	{
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
	}

document.getElementById("tinydoc_textcode").addEventListener("paste", function(e)
	{
	try
		{
		// CANCELING THE PASTE EVENT
		e.preventDefault();

		// GETTING THE CLIPBOARD CONTENT AS PLAIN TEXT
		var text = (e.originalEvent || e).clipboardData.getData("text/plain");

		// REPLACING SPECIAL CHARACTERS
		text = text.replace(/&/gm, "&amp;");
		text = text.replace(/</gm, "&lt;");
		text = text.replace(/>/gm, "&gt;");
		text = text.replace(/  /gm, "&nbsp;&nbsp;");
		text = text.replace(/\n/gm, "<br />");

		// PASTING THE TEXT
		document.execCommand("insertHTML", false, text);
		}
		catch(err)
		{
		}
	});

document.getElementById("tinydoc_textcode").addEventListener("keydown", function (e)
	{
	try
		{
		// IF THE LOADING SPLASH IS VISIBLE, IT MEANS THAT THE DOCUMENT IT IS BEEN SAVED
		// AND ALL THE KEYDOWN EVENTS WILL BE DISABLED BECAUSE OF THAT.
		if (document.getElementsByClassName("tinydoc_splash")[0].style.display == "block")
			{
			e.preventDefault();
			}
			else
			{
			//CODE FOR ADDING SPACES (TABS) WHEN THE TAB KEY IS DOWN
			if (e.keyCode==9)
				{
				// CANCELING THE TAB KEY EVENT
				e.preventDefault();

				// INSERTING SPACES AS A TAB SPACE
				document.execCommand("insertText", false, "          ");

				// GETTING THE FOCUS IN THE DOCUMENT
				document.getElementById("tinydoc_textcode").focus();

				// PRENTIVE DELAYED EVENT FOR GETTING FOCUS IN THE DOCUMENT
				setTimeout(function(){document.getElementById("tinydoc_textcode").focus()},200);
				}
			}
		}
		catch(err)
		{
		}
	});

document.getElementById("tinydoc_textcode").addEventListener("keyup", function (e)
	{
	// CHECKING FOR URL LINKS WHILE THE USER IS WRITING OR MOVING THROUGH THE DOCUMENT
	checkForURL();
	});

document.getElementById("tinydoc_textcode").addEventListener("input", function (e)
	{
	// SETTING THE DOCUMENT AS DIRTY WHEN THE USER IS TYPING
	window.onbeforeunload = function(e){return "Dirty"};
	});

window.addEventListener("load", function()
	{
	// SETTING THE WELCOME DOCUMENT
	document.getElementById("tinydoc_textcode").innerHTML = STRING_WELCOME;

	// GETTING THE FOCUS IN THE DOCUMENT
	document.getElementById("tinydoc_textcode").focus();

	// PRENTIVE DELAYED EVENT FOR GETTING FOCUS IN THE DOCUMENT
	setTimeout(function(){document.getElementById("tinydoc_textcode").focus()},200);

	// TRYING TO MOVE THE CURSOR TO THE BEGINNING OF THE DOCUMENT
	try
		{
		var range = document.createRange();
		var sel = window.getSelection();
		range.setStart(document.getElementById("tinydoc_textcode").childNodes[0], 0);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
		}
		catch(err)
		{
		}

	// SCROLLING TO THE TOP OF THE DOCUMENT
	try{document.getElementById("tinydoc_textcode").scrollTop = 0}catch(err){}

	// SETTING WHAT HAPPENS WHEN EACH ELEMENT IS CLICKED
	document.getElementById("tinydoc_textcode").addEventListener("click",function(event){checkForURL();});
	document.getElementById("tinydoc_textcode").addEventListener("contextmenu",function(event){checkForURL();});
	document.getElementById("buttonPrint").addEventListener("mousedown",function(event){printDocument();event.preventDefault()});
	document.getElementById("buttonUndo").addEventListener("mousedown",function(event){formatDoc("undo",null);checkForURL();event.preventDefault()});
	document.getElementById("buttonRedo").addEventListener("mousedown",function(event){formatDoc("redo",null);checkForURL();event.preventDefault()});
	document.getElementById("buttonBold").addEventListener("mousedown",function(event){formatDoc("bold",null);event.preventDefault()});
	document.getElementById("buttonItalic").addEventListener("mousedown",function(event){formatDoc("italic",null);event.preventDefault()});
	document.getElementById("buttonUnderline").addEventListener("mousedown",function(event){formatDoc("underline",null);event.preventDefault()});
	document.getElementById("buttonStrikethrough").addEventListener("mousedown",function(event){formatDoc("strikethrough",null);event.preventDefault()});
	document.getElementById("buttonDotted").addEventListener("mousedown",function(event){formatDoc("insertunorderedlist",null);event.preventDefault()});
	document.getElementById("buttonNumbered").addEventListener("mousedown",function(event){formatDoc("insertorderedlist",null);event.preventDefault()});
	document.getElementById("buttonClear").addEventListener("mousedown",function(event){formatDoc("removeFormat",null);event.preventDefault()});
	document.getElementById("buttonHighlight").addEventListener("mousedown",function(event){formatDoc("BackColor","#FFFF00");event.preventDefault()});
	document.getElementById("buttonLink").addEventListener("mousedown",function(event){insertLink();event.preventDefault()});
	});