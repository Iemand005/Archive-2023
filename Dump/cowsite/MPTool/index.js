xhr=new XMLHttpRequest();
function request(url,json,callback){xhr.open("POST",`https://${pfid}.playfabapi.com/${url}`,true);xhr.setRequestHeader('Content-Type','application/json');xhr.setRequestHeader("x-authorization","67A199B235138907--877978B6E9E9299E-20CA2-8DA764947CF1E8C-J7OkGDw0pAjkUKQW21ObkLnTkAFZ0nxZB15VHtNm1NI=");xhr.setRequestHeader("X-EntityToken",EntityToken);xhr.onload=function(){callback(JSON.parse(this.responseText))};xhr.send(json)}
/* How to use request
request("URL","JSON",function(response){
	console.log(response);
});
*/

	function SetEntityToken() {
		EntityToken = document.getElementById('EntityToken').value;
		if(EntityToken) {
			//console.log("CreatorId:", token.ec)
			//console.log("XboxUserId:", token.idi)
			//console.log("EntityId:", token.ei)

				request("Authentication/GetEntityToken","",function(response){
				document.getElementById("ES").innerHTML=response.code;
				console.log("New Entity Token: ", response.data.EntityToken);
				EntityToken=response.data.EntityToken
						console.log('Entity Token Set');
			var token = JSON.parse(atob(EntityToken).replace(/^.+{/, '{'))
			console.log(token)
			console.log("Generated:", token.i)
			console.log("Expire:", token.e)
		})
		} else {
			console.log("no token")
		}
	}
	function RenewEntityToken() {
		console.log(JSON.parse(`{"CreateAccount":true,"TitleId":"${pfid}","XboxToken":"${document.getElementById("XboxToken").value}"}`))
		/*xhr.open("POST", "https://20ca2.playfabapi.com/Client/LoginWithXbox", true);
		xhr.send(`{"CreateAccount":true,"TitleId":"${pfid}","XboxToken":"${document.getElementById("XboxToken").value}"}`);
		xhr.onload = */
request("Client/LoginWithXbox",`{"CreateAccount":true,"TitleId":"${pfid}","XboxToken":"${document.getElementById("XboxToken").value}"}`,function() {
			console.log(JSON.parse(this.responseText).data.SessionTicket);
			console.log(JSON.parse(this.responseText).data.EntityToken.EntityToken);
			EntityToken = JSON.parse(this.responseText).data.EntityToken.EntityToken
		})
	}

	function SearchMarketplace(skip=0,found=0) { //marketplace content lookup processor
		document.getElementById("sprogress_ico").innerHTML = `<img src="load.gif">`
		repeat = false
		var filters = ''
		if(document.getElementById("filter_free").checked == true) {
			var filters = ',"filter":"(displayProperties/price ge 0)and(displayProperties/price le 0)"'
		}
        if(document.getElementById("use_custom_filter").checked == true){
            console.log("Using custom filter:" + document.getElementById("cfilter").value )
            /*
            Note:
            - the filter is actually a lisp derivative of sorts, and as such has a set of properties and a grammar. 
            a validator or composer for such lisps might be useful, though im not certain it's within scope...
            */
            filters = ',"filter":"'
            filters += document.getElementById("cfilter").value + '"'
        }
		if(found==0){searchprogress(0);list=new Array}
		request(`Catalog/Search`,`{"count":true,"search":"${document.getElementById("search").value}","top":250${filters},"skip":${skip}}`,function(data){
			console.log(data);
			if(data.code == 200) {
				if(skip==0){console.log(data.data.Count)}
				if(data.data.Count<10000){searchcount=data.data.Count}else{searchcount=10000}
				found=found+data.data.Items.length
				searchprogress(found/searchcount*100)
				if(skip<10000) {
				if(data.data.Count-skip>250){skip=skip+250,repeat=true}} else {
					
				}
                //time for more cursedness (a true trend of my javascript)
				var table = document.getElementById("searchresulttable");
                data.data.Items.forEach(function(item,index){
					// for id list generating list+=item.Id+"\n";
					list.push(item.Id)
					var row = table.insertRow(-1)
					var c1 = row.insertCell(0);
					var c2 = row.insertCell(1);
					var c3 = row.insertCell(2);
					var c4 = row.insertCell(3);
					var c5 = row.insertCell(4);
                    if (item.Images.length > 0){
						c1.innerHTML = `<img style="max-height:80px; max-width:100px;" src=${item.Images[0].Url}>`
                    } else {
						c1.innerHTML = "No Thumb Found"
                    }
					c2.innerHTML = `${item.Title["en-US"]} (${item.Id})`
					c3.innerHTML = `${item.DisplayProperties.creatorName} (${item.CreatorEntityKey.Id})`
					c4.innerHTML = `${item.ContentType}`
					c5.innerHTML = `<button onclick=" window.open('https://www.mcmarket.place/id/${item.Id}','_blank')">mktpl</button>`
                });
                
			} else {
				console.log("error code:", data.code)
			}
			console.log(skip)
			if(repeat==true){
				SearchMarketplace(skip,found)
			}else{searchpercent=100;document.getElementById("sprogress_ico").innerHTML=""}
		})
		
	}

	function buyresults(){
		var x=0,i=setInterval(function(){
			console.log(list[x])
			request("Catalog/PurchaseItemById",`{"Currencies":[{"CurrencyId":"ecd19d3c-7635-402c-a185-eb11cb6c6946","ExpectedPrice":"0"}],"ItemId":"${list[x]}","Quantity":1}`,function(data){
				console.log(data);
				
			})
			x++;if(x===list.length){clearInterval(i)}},300);
	}

	function download() {
		var a=document.createElement('a');
		a.href='data:attachment/text,'+encodeURI(JSON.stringify(list));
		a.download='Items.json';
		a.click();
	  }

	function GetMarketplaceItem(id) {
		request("Catalog/GetPublishedItem",`{"ItemId":"${id}"}`,function(data){
			if(data.code==200){
            price = data.data.Item.Price.Prices[0].Amounts[0].Amount
			console.log(data);
			result("code", "<b> Request Status Code: </b>" + data.code);
			result("name", "<b> Item Name: </b>" + data.data.Item.Title.neutral);
			result("image", `<img src="${data.data.Item.Images[0].Url}" style="height:200px;">`);
			result("price", "<b> Item Price: </b>" + data.data.Item.Price.Prices[0].Amounts[0].Amount); document.getElementById("minecoin").style.display="inline-block";
			result("StartDate", "<b> Start Date: </b>" + data.data.Item.StartDate)
			result("CreationDate", "<b> Creation Date: </b>" + data.data.Item.CreationDate)
			result("LastModifiedDate", "<b> Last Modified: </b>" + data.data.Item.LastModifiedDate)
				//this is immensely cursed. im sorry. (It is indeed lol)
			let contentsString = "<table> <tr> <th> Type </th> <th> Min Client Version </th> <th> Max Client Version </th> <th> URL </th> </tr>"
				// result("download", "<b> Request Status Code: </b>"+data.data.Item.Contents[0].Url);
				// result("MinClientVersion", "<b> Min Client Ver: </b>"+data.data.Item.Contents[0].MinClientVersion)
				// result("MaxClientVersion", "<b> Max Client Ver: </b>"+data.data.Item.Contents[0].MaxClientVersion)
			data.data.Item.Contents.forEach(function(item, index) {
				contentsString += `<tr> <td> ${item.Type} </td> <td> ${item.MinClientVersion} </td> <td> ${item.MaxClientVersion} </td> <td> ${item.Url} </td> </tr> `
			});
			//cleanup and insert
			contentsString += "</table>"
			result("download", contentsString)
			result("creatorName", "<b> Creator Name: </b>" + data.data.Item.DisplayProperties.creatorName)
			result("Description", "<b> Item Description: </b>" + data.data.Item.Description.neutral)
		}else{result("code", "<b> Error: </b>" + data.code); document.getElementById("minecoin").style.display="none";}
		})
	}

	function PurchaseItem() {
			request("Catalog/PurchaseItemById",`{"Currencies":[{"CurrencyId":"ecd19d3c-7635-402c-a185-eb11cb6c6946","ExpectedPrice":"${price}"}],"ItemId":"${document.getElementById("id").value}","Quantity":1}`,function(data){
			console.log(data);
		})
	}
		function GetInventory() {
				request("inventory/GetInventoryItems",'',function(data){
				console.log(data);
				console.log(data.data.Items.length)
			data.data.Items.forEach(function(item){console.log(item.Amount, item.Id)})
			})
		}
	
		function searchresult(name, data){
			// child = document.createElement('div');
			// child.innerHTML=data;
			// document.getElementById(name).append(child);
			document.getElementById(name).innerHTML += data
		}

		function searchprogress(percent){
			console.log(Math.round(percent)+"%");
			document.getElementById("sprogress").innerHTML=Math.round(percent)+"%";
		}

	function result(name, data) {
		console.log(name + ":", data);
		document.getElementById(name).innerHTML = data;
	}

	function getpfid(){
	var id=document.getElementById('playfabid');pfid=id.options[id.selectedIndex].value
	console.log("PlayfabId: ",pfid, `https://${pfid}.playfabapi.com/`)
}
function filter(checkbox){
	var free=document.getElementById("filter_free");
	if(checkbox.checked){
		free.disabled = true;
	}else{
		free.disabled = false;
	}
}
function transferall(){
request("inventory/transferall","",function(response){console.log(response)})
}
function opentrade(){
request("inventory/opentrade",'{"OfferedInventoryInstanceIds": "0029d5b8-613a-427d-9b60-9e199fd6f935", "AllowedPlayerIds": "null", "RequestedCatalogItemIds": "null"}',function(response){console.log(response)})
}