(function(window) {
	// general use variables: the storage namespace
	var ns = "_sad4tfa_",
	// the date to use to invalidate cookies
	invalidate_cookie = "; expires=Thu, 01-Jan-1970 00:00:01 GMT",
	// regex quick ref
	scalar = /boolean|number|string/,
	// minify optimizations
	encodeURIComponent = window.encodeURIComponent, decodeURIComponent = window.decodeURIComponent,
	// json minify optimizations
	jsonParse = JSON.parse, jsonStringify = JSON.stringify;

	function addSeconds(date, seconds) {
		date.setMilliseconds(date.getMilliseconds() + (seconds * 1000));
		return date;
	}

	// simple page load only cache
	Classify("Game/Cookie", {
		invoke : function() {
			if (!this.instance) {
				this.instance = new this(86400);
			}
			return this.instance;
		},
		init : function(expire) {
			this.expire = expire || 0;
		},
		getItem : function(key) {
			var r;
			try {
				r = new RegExp("(?:^|; )" + encodeURIComponent(ns + key) + "=([^;]*)").exec(document.cookie);
				return r ? jsonParse(decodeURIComponent(r[1])) : null;
			} catch (e) {
				return null;
			}
		},
		setItem : function(key, value) {
			var expire = this.expire > 0 ? "; expires=" + addSeconds(new Date(), this.expire).toUTCString() : "";
			document.cookie = encodeURIComponent(ns + key) + "=" + encodeURIComponent(jsonStringify(value)) + expire;
		},
		removeItem : function(key) {
			document.cookie = encodeURIComponent(ns + key) + "=null" + invalidate_cookie;
		},
		clear : function() {
			var remove = [], key;
			try {
				document.cookie.replace(new RegExp("(?:^|; )(" + encodeURIComponent(ns) + "[^=]+)=[^;]*", "g"), function(m, key) {
					remove.push(key);
				});
				while (key = remove.pop()) {
					document.cookie = key + "=null" + invalidate_cookie;
				}
			} catch (e) {
			}
		}
	});

})(window);
