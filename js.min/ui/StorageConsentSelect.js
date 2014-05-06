define(["security/StorageConsentGuard"],function(e){var t=function(t,n){this._element=t,this._options=n,this._storageGuard=e.getInstance(),this._inner=this._element.innerHTML;var i,o=this._options.label.level,r="";for(i in o)o.hasOwnProperty(i)&&(r+="<option"+(i==this._storageGuard.getActiveLevel()?' selected="selected"':"")+' value="'+i+'">'+this._options.label.level[i]+"</option>");this._element.innerHTML='<label for="storage-consent">'+this._options.label.select+"</label>"+'<select id="storage-consent">'+r+"</select>",this._element.querySelector("select").addEventListener("change",this)};return t.options={label:{select:"Cookies",level:{all:"All",none:"None"}}},t.prototype.handleEvent=function(e){if("change"===e.type){var t=this._element.querySelector("select"),n=t.options[t.selectedIndex].value;this._storageGuard.setActiveLevel(n)}},t.prototype.unload=function(){this._element.querySelector("select").removeEventListener("change",this),this._element.innerHTML=this._inner},t});