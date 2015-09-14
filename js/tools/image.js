(function() {
	var posit = [];
	var colors = ['#ff0', '#fa0', '#00f', '#fff', '#f00', '#0d0'];
	var types = [
		"||", "||",
		"|222so|222o|2223|2226|222eg|222eg0|222eg1|222eg2|", 
		"|333o|333|333ni|edges|corners|ll|zbll|cll|ell|lse|cmll|f2l|lsll2|zbls|2gll|2gen|2genl|roux|3gen_F|3gen_L|RrU|half|lsll|pll|easyc|", 
		"|444|444o|444wca|444yj|4edge|RrUu|",
		"|555|555wca|5edge|",
		"|666si|666p|666s|6edge|666wca|",
		"|777si|777p|777s|7edge|777wca|",
		"|888|",
		"|999|",
		"|101010|",
		"|111111|"];
	
	function face(f,size) {
		var s = '<table style="border-collapse:collapse; border:2px solid;">';
		var l = kernel.getProp('imgSize') * $('#logo').width() / (46 * size);
		var tdstr = '<td style="border:1px solid; padding:'+l+'px 0px 0px 0px; width:'+l+'px; background:';
		var trstr = '<tr style="height:'+l+'px;">';
		for (var i=0; i<size; i++) {
			s += trstr;
			var x = f == 0 ? size-1-i : i;
			for (var j=0; j<size; j++) {
				var y = (f==1||f==2) ? size-1-j : j;
				s += tdstr + colors[posit[(f*size+x)*size+y]] + ';">';
			}
			s += '</tr>'
		}
		return s + "</table>";
	}
	
	/**
	 *	f: face, [ D L B U R F ]
	 *	d: which slice, in [0, size-1)
	 *	q: [  2 ']
	 */
	function doslice(f,d,q,size){
		var f1,f2,f3,f4;
		var s2=size*size;
		var c,i,j,k;
		if(f>5)f-=6;
		for(k=0; k<q; k++){
			for(i=0; i<size; i++){
				if(f==0){
					f1=6*s2-size*d-size+i;
					f2=2*s2-size*d-1-i;
					f3=3*s2-size*d-1-i;
					f4=5*s2-size*d-size+i;
				}else if(f==1){
					f1=3*s2+d+size*i;
					f2=3*s2+d-size*(i+1);
					f3=  s2+d-size*(i+1);
					f4=5*s2+d+size*i;
				}else if(f==2){
					f1=3*s2+d*size+i;
					f2=4*s2+size-1-d+size*i;
					f3=	 d*size+size-1-i;
					f4=2*s2-1-d-size*i;
				}else if(f==3){
					f1=4*s2+d*size+size-1-i;
					f2=2*s2+d*size+i;
					f3=  s2+d*size+i;
					f4=5*s2+d*size+size-1-i;
				}else if(f==4){
					f1=6*s2-1-d-size*i;
					f2=size-1-d+size*i;
					f3=2*s2+size-1-d+size*i;
					f4=4*s2-1-d-size*i;
				}else if(f==5){
					f1=4*s2-size-d*size+i;
					f2=2*s2-size+d-size*i;
					f3=s2-1-d*size-i;
					f4=4*s2+d+size*i;
				}
				c=posit[f1];
				posit[f1]=posit[f2];
				posit[f2]=posit[f3];
				posit[f3]=posit[f4];
				posit[f4]=c;
			}
			if(d==0){
				for(i=0; i+i<size; i++){
					for(j=0; j+j<size-1; j++){
						f1=f*s2+		 i+		 j*size;
						f3=f*s2+(size-1-i)+(size-1-j)*size;
						if(f<3){
							f2=f*s2+(size-1-j)+		 i*size;
							f4=f*s2+		 j+(size-1-i)*size;
						}else{
							f4=f*s2+(size-1-j)+		 i*size;
							f2=f*s2+		 j+(size-1-i)*size;
						}
						c=posit[f1];
						posit[f1]=posit[f2];
						posit[f2]=posit[f3];
						posit[f3]=posit[f4];
						posit[f4]=c;
					}
				}
			}
		}
	}

	function genImage(scramble) {
		var type = scramble[0];
		if (type == 'input') {
			type = tools.scrambleType(scramble[1]);
		}
		var size;
		for (size=0; size<12; size++) {
			if (types[size].indexOf('|' + type + '|') != -1) {
				break;
			}
		}
		if (size == 12) {
			return IMAGE_UNAVAILABLE;
		} else {
			return nnnImage(size, scramble[1]);
		}
	}

	function nnnImage(size, moveseq) {
		var cnt=0;
		for(var i=0; i<6; i++) {
			for(var f=0; f<size*size; f++) {
				posit[cnt++]=i;
			}
		}
		var moves = kernel.parseScramble(moveseq, "DLBURF");
		for (var s=0; s<moves.length; s++) {
			for (var d=0; d<moves[s][1]; d++) {
				doslice(moves[s][0], d, moves[s][2], size)
			}
			if (moves[s][1] == -1) {
				for (var d=0; d<size-1; d++) {
					doslice(moves[s][0], d, -moves[s][2], size);
				}
				doslice((moves[s][0]+3)%6, 0, moves[s][2]+4, size);
			}
		}
		return "<table><tr><td /><td>"+face(3,size)+"</td><td /><td /></tr><tr><td>"+face(1,size)+"</td><td>"+face(5,size)+"</td><td>"+face(4,size)+"</td><td>"+face(2,size)+"</td></tr><tr><td /><td>"+face(0,size)+"</td><td /><td /></tr></table>";
	}
	
	function execFunc(fdiv) {
		if (!fdiv) {
			return;
		}
		fdiv.html(genImage(tools.getCurScramble()));
	}
	
	$(function() {
		tools.regTool('image', TOOLS_IMAGE, execFunc);
	});

	return {
		draw: genImage
	}
})();
