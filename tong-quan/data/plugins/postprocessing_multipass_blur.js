/*
	krpano WebGL Post-Processing Plugin - Multi-Pass-Blur
	1.19


	A simple post-processing sharping effect as example.


	The krpano WebGL API:

	* krpano.webGL
	  - an object with all WebGL related stuff
	  - when the object is null, then there is no WebGL support

	* krpano.webGL.canvas
	  - the <canvas> element for the WebGL rendering

	* krpano.webGL.context
	  - the WebGL rendering context

	* shader = krpano.webGL.createPostProcessingShader(fragment_shader_source, uniforms)
	  - create a krpano post processing shader
	  - a WebGL GLSL fragment shader
	  - parameters:
	    - fragment_shader_source
	      - a GLSL shader source code as string
	      - the shaders code needs to have:
	        - a 'sm' named sampler2D - this will be the current screen as input texture
	        - a 'tx' named vec2 varying - this will be the current texture coordinate
	        - optionally a 'sz' vec2 uniform - this will contain the screen size
	    - uniforms
	      - a comma separated list of the uniform names used in the shader
	      - the 'uniform location' will be automatically stored at the returned
	        shader object with the same name
	  - return:
	    - a krpano shader object
	    - can be added to the 'ppShaderArray' Array
	    - or used for 'useShader'
	
	* krpano.webGL.ppShaderArray
	  - an Array of post-processing shaders
	  - here custom shaders can be added, inserted or removed
	  - the shaders will be processed by the order in that Array
	  
	* krpano.webGL.useShader(shader)
	  - select/activate the shader for interfacing
	  - e.g. for setting uniform values
	  - NOTE - after usage useShader(null) needs be called to restore
	    the previous shader! IMPORTANT!

	* krpano.webGL.deleteShader(shader)
	  - delete a shader (free-up the internal WebGL resources) 
*/

var krpanoplugin = function()
{
	var local  = this;

	// internal plugin information
	local.name    = "WebGL Post-Processing Plugin (Multi-Pass-Blur)";
	local.version = "1.19";

	var krpano = null;
	var plugin = null;
	
	// krpano WebGL pixel shaders
	var shader_passes = 6;		// the more the higher the quality at larger blur settings - need to be a multiple of 2
	var shaders = null;

	// xml attributes
	var xml_blur = 1.0;


	function get_shader_src()
	{
		return ""+
			"precision mediump float;"+
			"uniform sampler2D sm;"+			// sm = the screen as input texture sampler
			"uniform vec2 sz;"+					// sz = screen size in pixels (sz.x = width, sz.y = height)
			"uniform float blur;"+				// a custom uniform
			"uniform vec2 dir;"+				// a custom uniform
			"varying vec2 tx;"+					// tx = the texture coordinates (0.0,0.0 to 1.0,1.0)
			"void main()"+
			"{"+
				"float hblur  = dir.x * blur / sz.x;"+
				"float vblur  = dir.y * blur / sz.y;"+
				"vec4 sum = vec4(0.0);"+
				"sum += texture2D(sm, vec2(tx.x - 4.0*hblur, tx.y - 4.0*vblur)) * 0.0162162162;"+
				"sum += texture2D(sm, vec2(tx.x - 3.0*hblur, tx.y - 3.0*vblur)) * 0.0540540541;"+
				"sum += texture2D(sm, vec2(tx.x - 2.0*hblur, tx.y - 2.0*vblur)) * 0.1216216216;"+
				"sum += texture2D(sm, vec2(tx.x - 1.0*hblur, tx.y - 1.0*vblur)) * 0.1945945946;"+
				"sum += texture2D(sm, vec2(tx.x,             tx.y)            ) * 0.2270270270;"+
				"sum += texture2D(sm, vec2(tx.x + 1.0*hblur, tx.y + 1.0*vblur)) * 0.1945945946;"+
				"sum += texture2D(sm, vec2(tx.x + 2.0*hblur, tx.y + 2.0*vblur)) * 0.1216216216;"+
				"sum += texture2D(sm, vec2(tx.x + 3.0*hblur, tx.y + 3.0*vblur)) * 0.0540540541;"+
				"sum += texture2D(sm, vec2(tx.x + 4.0*hblur, tx.y + 4.0*vblur)) * 0.0162162162;"+
				"gl_FragColor = vec4(sum.rgb, 1.0);"+
			"}";
	}
	


	// plugin entry point
	local.registerplugin = function(krpanointerface, pluginpath, pluginobject)
	{
		krpano = krpanointerface;
		plugin = pluginobject;

		if (krpano.version < "1.19" || krpano.build < "2016-04-01")
		{
			krpano.trace(3, local.name+" - too old krpano version (min. 1.19)");
			return;
		}

		// check for WebGL support
		if (krpano.webGL)
		{
			shaders = new Array(shader_passes);
			
			// create a custom shader with custom 'blur' and 'dir' uniforms and
			// a 'sz' uniform (a krpano internal uniform for the screen size)
			for (var i=0; i < shader_passes; i++)
			{
				shaders[i] = krpano.webGL.createPostProcessingShader( get_shader_src(), "blur,dir,sz");
			
				if (shaders[i])
				{
					// add the shaders as last ones to an Array of krpano post-processing shaders
					krpano.webGL.ppShaderArray.push( shaders[i] );
				}
			}
			
			// add plugin attributes (will automatically also call the 'set' callback to init the value)
			plugin.registerattribute("blur", xml_blur, api_blur_set, api_blur_get);
		}
	}


	function remove_shader_from_krpano()
	{
		// get the Array of krpano post-processing shader
		var ppShaderArray = krpano.webGL.ppShaderArray;

		// look for the own-added shader and remove it
		for (var i=0; i<ppShaderArray.length; i++)
		for (var j=0; j<shader_passes; j++)
		{
			if ( ppShaderArray[i] === shaders[j] )
			{
				ppShaderArray.splice(i,1);
				shaders[j] = null;
			}
		}
	}


	local.unloadplugin = function()
	{
		if (shaders)
		{
			for (var i=0; i<shader_passes; i++)
			{
				krpano.webGL.deleteShader(shaders[i]);
			}
			
			remove_shader_from_krpano();
			
			shaders = null;
		}

		krpano = null;
		plugin = null;
	}


	function api_blur_set(value)
	{
		// convert to number
		value = Number(value);

		// is a valid number?
		if ( !isNaN(value) )
		{
			xml_blur = value;

			// update the shader uniform
			api_blur_update();
		}
	}


	function api_blur_get()
	{
		return xml_blur;
	}


	function api_blur_update()
	{
		// update the shader
		if (shaders)
		{
			for (var i=0; i<shader_passes; i++)
			{
				// select/activate the shader for interfacing
				krpano.webGL.useShader(shaders[i]);
				
				var pass_blur = (((i >> 1)+1) / (shader_passes/2.0)) * xml_blur;
				var pass_dir = (i & 1) == 0 ? 1.0 : 0.0;
	
				// set/update the value for the 'blur' uniform
				krpano.webGL.context.uniform1f(shaders[i].blur, pass_blur);
				krpano.webGL.context.uniform2f(shaders[i].dir, pass_dir, 1.0 - pass_dir);
			}

			// restore
			krpano.webGL.useShader(null);
			
			// need a redraw
			krpano.view.haschanged = true;
		}
	}
}
