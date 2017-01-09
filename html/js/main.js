var database;
var wdProtocol = "echo-protocol"
var wsUri = "ws://192.168.178.53:8080/";
var output;

$(function() {
  init_interface();
  init_websocket();
});


  function init_websocket()
  {
    output = document.getElementById("console_output");
    testWebSocket();
  }

  function testWebSocket()
  {
    websocket = new WebSocket(wsUri,wdProtocol);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
  }

  function onOpen(evt)
  {
    writeToScreen("CONNECTED");
    doSend("WebSocket rocks");
  }

  function onClose(evt)
  {
    writeToScreen("DISCONNECTED");
  }

  function onMessage(evt)
  {
    writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
    websocket.close();
  }

  function onError(evt)
  {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
  }

  function doSend(message)
  {
    writeToScreen("SENT: " + message);
    websocket.send(message);
  }

  function writeToScreen(message)
  {
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
  }





function init_interface()
{
  //Load Settings template
  $.getJSON("/data/settings.json", function(json) {
    console.log(json);
    database = json;

    //Select Lens parameters
    cam_params = database["cameras"][0]["settings"];

    var camera_tab_html = "";
    $.each(cam_params[0]["params"],function( key, obj )
    {
      if(obj["inactive"] == 1)
      {
        console.log("Settings Param '"+obj["name"]+"' is inactive");
      }
      else
      {
        camera_tab_html += build_form(obj,cam_params[0]["id"]);
      }
    });
    $.each(cam_params[1]["params"],function( key, obj )
    {
      if(obj["inactive"] == 1)
      {
        console.log("Settings Param '"+obj["name"]+"' is inactive");
      }
      else
      {
        camera_tab_html += build_form(obj,cam_params[1]["id"]);
      }
    });
    $("#content-1").html(camera_tab_html);

    var audio_tab_html = "";
    $.each(cam_params[2]["params"],function( key, obj )
    {
      if(obj["inactive"] == 1)
      {
        console.log("Settings Param '"+obj["name"]+"' is inactive");
      }
      else
      {
        audio_tab_html += build_form(obj,cam_params[2]["id"]);
      }
    });
    $("#content-2").html(audio_tab_html);

    var monitoring_tab_html = "";
    $.each(cam_params[3]["params"],function( key, obj )
    {
      if(obj["inactive"] == 1)
      {
        console.log("Settings Param '"+obj["name"]+"' is inactive");
      }
      else
      {
        monitoring_tab_html += build_form(obj,cam_params[3]["id"]);
      }
    });
    $.each(cam_params[4]["params"],function( key, obj )
    {
      if(obj["inactive"] == 1)
      {
        console.log("Settings Param '"+obj["name"]+"' is inactive");
      }
      else
      {
        monitoring_tab_html += build_form(obj,cam_params[4]["id"]);
      }
    });
    $("#content-3").html(monitoring_tab_html);


    var setup_tab_html = "";
    $.each(cam_params[5]["params"],function( key, obj )
    {
      if(obj["inactive"] == 1)
      {
        console.log("Settings Param '"+obj["name"]+"' is inactive");
      }
      else
      {
        setup_tab_html += build_form(obj,cam_params[5]["id"]);
      }
    });
    $.each(cam_params[6]["params"],function( key, obj )
    {
      if(obj["inactive"] == 1)
      {
        console.log("Settings Param '"+obj["name"]+"' is inactive");
      }
      else
      {
        setup_tab_html += build_form(obj,cam_params[6]["id"]);
      }
    });
    $.each(cam_params[7]["params"],function( key, obj )
    {
      if(obj["inactive"] == 1)
      {
        console.log("Settings Param '"+obj["name"]+"' is inactive");
      }
      else
      {
        setup_tab_html += build_form(obj,cam_params[7]["id"]);
      }
    });
    $("#content-4").html(setup_tab_html);


    var color_tab_html = "";
    $.each(cam_params[8]["params"],function( key, obj )
    {
      if(obj["inactive"] == 1)
      {
        console.log("Settings Param '"+obj["name"]+"' is inactive");
      }
      else
      {
        color_tab_html += build_form(obj,cam_params[8]["id"]);
      }
    });
    $("#content-5").html(color_tab_html);

    interface_events();
});
}

function build_form(obj,group_id)
{
  var field_html = "";
  switch(obj["fieldtype"])
  {
      case "range":
        field_html += "<div class='param range'>";
        field_html += "<label for='"+obj["name"]+"' description='"+obj["description"]+"'>"+obj["label"]+"</label>";
        field_html += "<input type='range' min='"+obj["min"]+"' data-group-id='"+group_id+"' data-param-id='"+obj["id"]+"' max='"+obj["max"]+"' value='"+obj["value"]+"' id='"+obj["name"]+"' step='0.05'>";
        field_html += "<div class='val_min'>"+obj["min"]+"</div>";
        field_html += "<div class='val_current'>"+obj["value"]+"</div>";
        field_html += "<div class='val_max'>"+obj["max"]+"</div>";
        field_html += "</div>";
      break;

      case "counter":
        field_html += "<div class='param counter'>";
        field_html += "<label for='"+obj["name"]+"' description='"+obj["description"]+"'>"+obj["label"]+"</label>";
        field_html += "<input type='button' value='-' class='qtyminus' field='quantity' />";
        field_html += "<input type='text' data-group-id='"+group_id+"' data-param-id='"+obj["id"]+"'  name='quantity' min='"+obj["min"]+"' max='"+obj["min"]+"' value='"+obj["value"]+"' id='"+obj["name"]+"' step='.05' class='qty' />";
        field_html += "<input type='button' value='+' class='qtyplus' field='quantity' />";
        field_html += "</div>";
      break;

      case "bang":
        field_html += "<div class='param bang'>";
        field_html += "<label for='"+obj["name"]+"' description='"+obj["description"]+"'>"+obj["label"]+"</label>";
        field_html += "<button type='button' data-group-id='"+group_id+"' data-param-id='"+obj["id"]+"' value='"+obj["value"]+"' id='"+obj["name"]+"' >"+obj["button_label"]+"</button>";
        field_html += "</div>";
      break;

      case "radio":

      field_html += "<div class='param radio boolean'>";
      field_html += "<label for='"+obj["name"]+"' description='"+obj["description"]+"'>"+obj["label"]+"</label>";
      field_html += "<div class='radioborder'>";

      switch(obj["datatype"])
        {
          case "boolean":

            if(obj["value"] == true) {
              field_html += "<label class='container'><input type='radio' data-group-id='"+group_id+"' data-param-id='"+obj["id"]+"'  name='"+obj["name"]+"' value='1' checked><span>Enabled</span></label>";
              field_html += "<label class='container'><input type='radio' data-group-id='"+group_id+"' data-param-id='"+obj["id"]+"'  name='"+obj["name"]+"' value='0'><span>Disabled</span></label>";
            }
            else {
              field_html += "<label class='container'><input type='radio' data-group-id='"+group_id+"' data-param-id='"+obj["id"]+"'  name='"+obj["name"]+"' value='1'><span>Enabled</span></label>";
              field_html += "<label class='container'><input type='radio' data-group-id='"+group_id+"' data-param-id='"+obj["id"]+"'  name='"+obj["name"]+"' value='0' checked><span>Disabled</span></label>";
            }

          break;

          case "enum":
            $.each(obj["enum"],function( key, value )
            {
              var checked_flag = "";
              if(key == obj["value"])
              {
                checked_flag = "checked";
              }
              field_html += "<label class='container'><input type='radio' data-group-id='"+group_id+"' data-param-id='"+obj["id"]+"'  name='"+obj["name"]+"' value='"+key+"' "+checked_flag+"><span>"+value+"</span></label>";

            });
          break;

        }

        field_html += "</div>";
        field_html += "</div>";

      break;

      case "array":
        field_html += '<div class="fieldsection"><p>'+obj["label"]+'</p>';
        $.each(obj["params"],function( key, subobj )
        {
          if(subobj["inactive"] == 1)
          {
            console.log("Settings Param '"+subobj["name"]+"' is inactive");
          }
          else
          {
            field_html += build_form(subobj,group_id);
          }
        });
        field_html += '</div>';

      break;

  }
  return field_html;
  console.log(obj);
}

function interface_events()
{
  // This button will increment the value
     $('.qtyplus').click(function(e){
         // Stop acting like a button
         e.preventDefault();
         // Get the field name
         fieldName = $(this).attr('field');
         // Get its current value
         var currentVal = parseFloat($('input[name='+fieldName+']').val());

         //Steps to Jump
         var stepSize = parseFloat($('input[name='+fieldName+']').attr("step"));

         // If is not undefined
         if (!isNaN(currentVal)) {
             // Increment
             $('input[name='+fieldName+']').val((currentVal + stepSize).toFixed(2));
         } else {
             // Otherwise put a 0 there
             $('input[name='+fieldName+']').val(0);
         }
     });
     // This button will decrement the value till 0
     $(".qtyminus").click(function(e) {
         // Stop acting like a button
         e.preventDefault();
         // Get the field name
         fieldName = $(this).attr('field');
         // Get its current value
         var currentVal = parseFloat($('input[name='+fieldName+']').val());

         //Steps to Jump
         var stepSize = parseFloat($('input[name='+fieldName+']').attr("step"));

         // If it isn't undefined or its greater than 0
         if (!isNaN(currentVal) && currentVal > 0) {
             // Decrement one
             $('input[name='+fieldName+']').val((currentVal - stepSize).toFixed(2));
         } else {
             // Otherwise put a 0 there
             $('input[name='+fieldName+']').val(0);
         }
     });

     $( ".param.range input[type='range']" ).on("input change", function() {
       $(this).parent().find(".val_current").html($(this).val());
});

}
