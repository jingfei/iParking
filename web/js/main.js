$(document).ready(function(){
	var reader = new FileReader();
	$("#addrSubmit").click(function(event){
		event.preventDefault();
		$.ajax({
			method: "POST",
			url: "http://140.116.245.252:8080/api/getAddress", 
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
	$("#locSubmit").click(function(event){
		event.preventDefault();
		$.ajax({
			method: "POST",
			url: "http://140.116.245.252:8080/api/getLoc", 
			data: {
				addr: $("#addr").val(),
				lang: $("#lang").val(),
			}
		}).done(function(msg){
			$("#locMessage").show();
			var firstAddr = true;
			var out = "<table><tr><th>language</th><td>&nbsp;&nbsp;</td><td>";
			out += $("#lang2").val()+"</td></tr><tr><th>address</th><td>&nbsp;&nbsp;</td><td>"
			out += $("#addr").val()+"</td></tr><tr><th>location</th><td>&nbsp;&nbsp;</td><td>(";
			out += msg["result"]["loc_x"]+", "+msg["result"]["loc_y"]+")</td></tr>";
			out += "</table>";
			$("#locMessage").html(out);
		});
	});
	$("#imgSubmit").click(function(event){
		event.preventDefault();
		$(".form").addClass("loading");
		var way = $("input[name=image_way]:checked").val(), imageVal;
		if(way == "file") imageVal = reader.result.substring(reader.result.search(",")+1);
		else imageVal = $("#image_base64").val();
		$.ajax({
			method: "POST",
			url: "http://140.116.245.252:8080/api/analysisIMG", 
			data: {
				image: imageVal,
			}
		}).done(function(msg){
			$(".form").removeClass("loading");
			$("#imgMessage").show();
			var out = "<table><tr><th>stdout</th><td>&nbsp;&nbsp;</td><td>";
			out += msg["result"]["stdout"]+"</td></tr><tr><th>stderr</th><td>&nbsp;&nbsp;</td><td>";
			out += msg["result"]["stderr"]+"</td></tr></table>";
			out += "<img src='data:image/jpeg;base64,"+imageVal+"' style='width: 100%' />";
			$("#imgMessage").html(out);
		});
	});
	/* radio change */
	$('input[name=image_way]').on('change', function(){
		if($(this).val()=="file"){
			$("#file_field").show();
			$("#base64_field").hide();
		}
		else{
			$("#file_field").hide();
			$("#base64_field").show();
		}
	});
	/* file change */
	$(':file').change(function(){
		var file = this.files[0];
		if(file) reader.readAsDataURL(file);
	});
});

