var lollipopsJS = {
	painter: [],
	proteinSize: "",
	xCoordLabels: [],

	resetPainter: function () {
		this.painter.lineWidth = "5";
		this.painter.strokeStyle = "black";

		this.painter.shadowBlur = 0;
		this.painter.fillStyle = "black";
		this.painter.shadowOffsetX = 0;
		this.painter.shadowOffsetY = 0;

		this.painter.font = "40px sans-serif";
		this.painter.textAlign = "center";
		this.painter.textBaseline = "middle";

	},

	prepareCanvas: function () {
		//Clears canvas
        var canvas = this.painter.canvas;
        this.painter.clearRect(0, 0, canvas.width, canvas.height);
        
        //Draws backbone
		this.resetPainter();
		this.painter.fillStyle = "#BABDB6";
		this.painter.fillRect(250, 300, 3500, 100);

		//Draws x-axis
		this.resetPainter();
		this.painter.beginPath();
		this.painter.strokeStyle = "gray";
		this.painter.moveTo(250, 525);
		this.painter.lineTo(250, 500);
		this.painter.lineTo(3750, 500);
		this.painter.lineTo(3750, 525);
		this.painter.stroke();
	},

	convertXCoord: function (aa) {
		var newCoord = ((aa - 1) / (proteinSize - 1)) * 3500 + 250;
		return newCoord;
	},

	drawXAxisLabel: function (position) {

		//Draws tick mark
		this.resetPainter();
		this.painter.beginPath();
		this.painter.strokeStyle = "gray";
		this.painter.moveTo(this.convertXCoord(position), 525);
		this.painter.lineTo(this.convertXCoord(position), 500);
		this.painter.stroke();

		//Draws text label
		this.resetPainter();

		if (this.xCoordLabels.length === 0) {
			this.painter.fillText(position, this.convertXCoord(position), 560);
			this.xCoordLabels.push(position);
		} else {
			//If other labels have already been drawn, check for overlap
			var draw = true;

			for (var k in this.xCoordLabels) {
				var distance = position - this.xCoordLabels[k];
				if (distance > 0 && distance < proteinSize / 40) {
					draw = false;
				}
			}

			if (draw) {
				this.painter.fillText(position, this.convertXCoord(position), 560);
				this.xCoordLabels.push(position);
			}
		}
	},

	drawDomain: function (label, start, end, color) {
		//Draws domain rectangles with shadow
		this.resetPainter();
		this.painter.fillStyle = color;
		this.painter.shadowBlur = 30;
		this.painter.shadowOffsetX = 10;
		this.painter.shadowOffsetY = 10;
		this.painter.shadowColor = "gray";
		this.painter.fillRect(this.convertXCoord(start), 275, this.convertXCoord(end) - this.convertXCoord(start), 150);

		//Draws domain label
		this.resetPainter();
		this.painter.fillStyle = "white";
		this.painter.shadowBlur = 5;

		//Checks text width before drawing
		var endXCoord = this.convertXCoord(end);
		var startXCoord = this.convertXCoord(start);
		var domainSize = endXCoord - startXCoord;
		if (this.painter.measureText(label[0]).width < domainSize) {
			this.painter.fillText(label[0], 0.5 * (startXCoord + endXCoord), 350);
		} else if (this.painter.measureText(label[1]).width < domainSize) {
			this.painter.fillText(label[1], 0.5 * (startXCoord + endXCoord), 350);
		}

		//Draws aa position label
		this.resetPainter();
		this.drawXAxisLabel(start);
		this.drawXAxisLabel(end);

	},

	drawVariant: function (index, domains, variants, colors) {
        //Removes non-numeric characters from label to set aa position
        var aaCoord = variants[index].replace(/\D/g, "");
        var distances = [];
        var yTop = 150; //Assumes variant does not overlap
        var yBottom = 300; //Assumes variant is not in a labelled domain
        
        //Sets top y-coordinate of lollipop stick
        for (var i in variants) {
            
            var distance = variants[i].replace(/\D/g, "") - aaCoord;

            if (distance > 0 && distance < proteinSize / 20) {
                yTop = 200;
            } else if (distance < 0 && distance > -proteinSize / 20) {
                yTop = 100;
            }
        }
        
        //Sets bottom y-coordinate of lollipop stick
        for (var i in domains) {
			if (aaCoord >= domains[i].aliStart && aaCoord <= domains[i].aliEnd) {
				yBottom = 275;
			}
		}
        
        //Draws lollipop stick
		this.resetPainter();
		this.painter.strokeStyle = "gray";
		this.painter.beginPath();
		this.painter.moveTo(this.convertXCoord(aaCoord), yBottom);
		this.painter.lineTo(this.convertXCoord(aaCoord), yTop);
		this.painter.stroke();

		//Draws lollipop
		this.resetPainter();
        
        try {   //Sets lollipop color if defined
            this.painter.fillStyle = colors[index]; 
        } catch(e) {
            this.painter.fillStyle = "black";
        }

		this.painter.strokeStyle = "gray";
		this.painter.beginPath();
		this.painter.arc(this.convertXCoord(aaCoord), yTop, 20, 0, 2 * Math.PI);
		this.painter.fill();

		//Draws variant label
		this.resetPainter();
		this.painter.textBaseline = "bottom";
		this.painter.font = "48px sans-serif";
		this.painter.fillText(variants[index], this.convertXCoord(aaCoord), yTop - 20);
        
	},
    
    drawProtein: function (canvasId, uniProtAcc, variants, colors) {
        
        this.painter = document.getElementById(canvasId).getContext("2d");
		this.prepareCanvas();

		$.ajax({
			url: "https://script.google.com/macros/s/AKfycbxFaTXkIeWhhfQmGISYoKAc1TmpijjCpuUKzXUjR1sOP-0hh1o/exec?url=http://pfam.xfam.org/protein/" + uniProtAcc + "/graphic",
			datatype: "txt",
			success: function (response) {
				var model = JSON.parse(JSON.parse(response).results[0]);

				proteinSize = model[0].length;
				lollipopsJS.drawXAxisLabel(proteinSize);

				var domains = model[0].regions;

				//Draws domains
				for (var i in domains) {
					lollipopsJS.drawDomain([domains[i].metadata.description, domains[i].text], domains[i].aliStart, domains[i].aliEnd, domains[i].colour);
				}

				for (var j in variants) {
					lollipopsJS.drawVariant(j, domains, variants, colors);
				}
			}
		});
	}

};
