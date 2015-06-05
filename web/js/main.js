$(document).ready(function(){
	$("#addrSubmit").click(function(event){
		event.preventDefault();
		$.ajax({
			method: "POST",
			url: "http://140.116.246.222:8080/api/getAddress", 
			data: {
				loc_x: $("#loc_x").val(),
				loc_y: $("#loc_y").val(),
				lang: $("#lang").val(),
			}
		}).done(function(msg){
			$("#addrMessage").show();
			var firstAddr = true;
			var out = "<table><tr><th>language</th><td>&nbsp;&nbsp;</td><td>";
			out += $("#lang").val()+"</td></tr><tr><th>location</th><td>&nbsp;&nbsp;</td><td>"
			out += msg["result"]["loc"]+"</td></tr><tr><th>road</th><td>&nbsp;&nbsp;</td><td>";
			out += msg["result"]["road"]+"</td></tr>";
			for(var adr in msg["result"]["address"]){
				var s = msg["result"]["address"][adr];
				if(firstAddr){
					firstAddr = false;
					out += "<tr><th>address</th><td>&nbsp;&nbsp;</td><td>"+s+"</td></tr>";
				}
				else out += "<tr><td></td><td>&nbsp;&nbsp;</td><td>"+s+"</td></tr>";
			}
			out += "</table>";
			$("#addrMessage").html(out);
		});
	});
	$("#imgSubmit").click(function(event){
		event.preventDefault();
		$.ajax({
			method: "POST",
			url: "http://140.116.246.222:8080/api/analysisIMG", 
			data: {
				image: $("#image").val(),
			}
		}).done(function(msg){
			$("#imgMessage").show();
			var out = "<table><tr><th>stdout</th><td>&nbsp;&nbsp;</td><td>";
			out += msg["result"]["stdout"]+"</td></tr><tr><th>stderr</th><td>&nbsp;&nbsp;</td><td>";
			out += msg["result"]["stderr"]+"</td></tr></table>";
			$("#imgMessage").html(out);
		});
	});
});

