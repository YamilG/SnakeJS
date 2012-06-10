$(document).ready(function(){

	// Canvas
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();

	// Saving cell width
	var cw = 10;
	var d;
	var food;
	var score;

	// Creating the snake
	var snake_array;

	function init()
	{
		d = "right";
		create_snake();
		create_food();
		score = 0;
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
	}

	init();
	
	function create_snake()
	{
		var length = 5; // Length of the snake
		snake_array = []; // Empty array to start with
		for(var i = length-1; i>=0; i++)
		{
			// Will create horizontal snake starting from the top left
			snake_array.push({x: i, y:0});
		}
	}

	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw),
		}
	}

	// Painting the snake
	function paint()
	{

		// Painting the canvas
		ctx.fillStyle = "white";
		ctx.fillRect(0,0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0,0,w,h);
		// Movement code for the snake
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;

		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;

		// The game over case

		if (nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
		{
			init();
			return;
		}

		// Eating the food

		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y:ny};
			score++;
			create_food();
		}
		else
		{
			var tail = snake_array.pop();
			tail.x = nx; tail.y = ny;
		}

		
		snake_array.unshift(tail);

		for(var i=0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			pain_cell(c.x, c.y);
			
		}
	}

	// Painting the food

	pain_cell(food.x, food.y);
	var score_text = "Score: " + score;
	ctx.fillText(score_text, 5, h-5);

	function pain_cell(x, y) 
	{
		ctx.fillStyle = "blue";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw,y*cw,cw,cw);
	}

	// Checking collitions

	function check_collision(x,y,array)
	{
		for (var i = 0; i < array.length; i++)
		{
			if (array[i].x == x && array[i].y == y)
			{
				return true;
			}
			return false;
		}

	// Adding keyboard controls

	$(document).keyboard(funtion(e) {
		var key = e.which;
		if(key == "37" && d != "right") d = "left";
		else if (key == "38" && d != "down") d = "up";
		else if (key == "39" && d != "left") d = "right";
		else if (key == "40" && d != "up") d = "down";
	})

	// Moving the snake using a timer, will trigger the paint function
	// every 60ms

});