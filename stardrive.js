/*!
 * stardrive v0.1 ~ Copyright (c) 2015 Sean Feil, http://seanfeil.com
 * http://www.github.com/resorath/stardrive
 * TODO: License
 */


(function(window){

	'use strict';

	//constructor
	var stardrive = function (canvas, options) {

		this.canvas = canvas;
		this.options = 
		{
			starInnerRadius: 5,
			starOuterRadius: 10,
			starFilled: true,
			starColour: '#FFFFFF',
			starSpikes: 5,
			lineColour: '#FFFFFF',
			lineSpeed: 0.016,
			wrapStarWalk: true
		};

		// User defined options
		for (var i in options) this.options[i] = options[i];

        //c.clearRect(0, 0, canvas.width, canvas.height);
	};

	// prototype
	stardrive.prototype = {

		starWalk: function(map)
	    {
	    	this.stars(map);
	    	this.starTrace(map);

	    },

	    stars: function(map)
	    {
	      // set initial star pair
	      var originStarX, originStarY;
	      var currentStarX = originStarX = map[0];
	      var currentStarY = originStarY = map[1];

	      // draw the first star
	      this.drawStar(currentStarX, currentStarY);


	      // loop over pairs, drawing the next star
	      for(var i=2; i<map.length; i++)
	      {
	        var previousStarX = currentStarX;
	        var previousStarY = currentStarY;

	        currentStarX = map[i];
	        currentStarY = map[++i];

	        this.drawStar(currentStarX, currentStarY);
	      }
	    },

	    starTrace: function(map)
	    {
	      // set initial star pair
	      var originStarX, originStarY;
	      var currentStarX = originStarX = map[0];
	      var currentStarY = originStarY = map[1];

	      // loop over pairs, drawing the connecting line
	      for(var i=2; i<map.length; i++)
	      {
	        var previousStarX = currentStarX;
	        var previousStarY = currentStarY;

	        currentStarX = map[i];
	        currentStarY = map[++i];

	        this.drawLine(previousStarX, previousStarY, currentStarX, currentStarY);

	      }

	      // draw a line from the last star to the first star
	      if(this.options.wrapStarWalk)
	        this.drawLine(currentStarX, currentStarY, originStarX, originStarY);
	    },

	    starPair: function(x1, y1, x2, y2)
	    {
	      this.drawStar(x1, y1);
	      this.drawStar(x2, y2);
	      this.drawLine(x1, y1, x2, y2);
	    },

	    drawLine: function(startX,startY,endX,endY)
	    {
	      var c = this.canvas.getContext("2d");
	      var amount = 0;
	      var opts = this.options;
	      var lineAnim = setInterval(function() {
	          amount += opts.lineSpeed; // (default 0.02)
	          if (amount > 1)
	          {
	            amount = 1;
	          }

	          c.beginPath();
	          c.strokeStyle = opts.lineColour;
	          c.lineWidth=1;
	          c.moveTo(startX, startY);
	          // lerp : a  + (b - a) * f
	          c.lineTo(startX + (endX - startX) * amount, startY + (endY - startY) * amount);
	          c.stroke();

	          c.closePath();

	          if(amount >= 1)
	          {
	            clearInterval(lineAnim);
	          }
	      }, 30);

	    },

	    drawStar: function(cx,cy){

	      var spikes = this.options.starSpikes;
	      var outerRadius = this.options.starOuterRadius;
	      var innerRadius = this.options.starInnerRadius;
	    
	      var ctx = this.canvas.getContext("2d");

	          var rot=Math.PI/2*3;
	          var x=cx;
	          var y=cy;
	          var step=Math.PI/spikes;


	          ctx.beginPath();
	          ctx.strokeStyle=this.options.starColour;
	          ctx.lineWidth=1;
	          ctx.moveTo(cx,cy-outerRadius)
	          for(var i=0;i<spikes;i++)
	          {
	              x=cx+Math.cos(rot)*outerRadius;
	              y=cy+Math.sin(rot)*outerRadius;
	              ctx.lineTo(x,y)
	              rot+=step

	              x=cx+Math.cos(rot)*innerRadius;
	              y=cy+Math.sin(rot)*innerRadius;
	              ctx.lineTo(x,y)
	              rot+=step
	          }
	          ctx.lineTo(cx,cy-outerRadius)
	          ctx.stroke();

	          ctx.closePath();

	          if(this.options.starFilled)
	          {
		          ctx.fillStyle = this.options.starColour;
		          ctx.fill();
		      }
	    },


	    getRandomArbitrary: function(min, max) {
	      return Math.random() * (max - min) + min;
	  	}

	}

	if (typeof exports !== 'undefined') exports.stardrive = stardrive;
	else window.stardrive = stardrive;


})(window);