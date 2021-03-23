
var current_model;

function is_pii(input_string, tf, current_model)
{
    var final_result = new Promise(function(resolve, reject)
    {
        //window.final_prediction='';
        var patt = /\d\d\d-\d\d\d-\d\d\d\d/i;
        var result = input_string.match(patt);
        var ssn_number_present = 0;
        var final_prediction;
        if(result !== null)
        {
            ssn_number_present = 1;
        }

        patt = /ssn/i;
        result = input_string.match(patt);
        var ssn_present = 0;
        if(result !== null)
        {
            ssn_present = 1;
        }
        console.log("Data passed");
        console.log(tf.tensor([[ssn_present, ssn_number_present]]));
        result = current_model.predict(tf.tensor([[ssn_present, ssn_number_present]]));
        result.array().then
        (
            array => {
                console.log(array[0][0]);
                console.log(array[0][0] > 0.5);
            if(array[0][0] > 0.5) 
            { 
                window.final_prediction=true;
            } 
            else 
            { 
                window.final_prediction=false;
            }
            console.log("In the pii functionm");
            resolve(window.final_prediction);
            
        });
    })
    return final_result;
}


const load_model = async (tf) => 
{
    console.log("Entered function load model");
    const MODEL_URL = 'http://127.0.0.1:8000/notebooks/tfjs_pii_model/model.json';
    async function start(tf)
    {
        const current_model = await tf.loadLayersModel(MODEL_URL);
        console.log(current_model);
        console.log("Model has been loaded");
        return current_model;
    }
    const current_model = await start(tf);
    console.log("Exit function load model");
    return current_model;
}

var MyPageData = {};
var fr;
MyPageData.cur_files = [];
MyPageData.js_required = 1;
var upload_button = function () 
{
    require(['tf'], function(tf) 
    { 
        $("#upload_span_input").change(function (event)
        {
            console.log("Upload file Event SPAN");
            MyPageData.cur_files_data = this.files;
            if(MyPageData.cur_files_data.length > 0)
            {
                console.log("Assigning cur_files");
                for(i=0; i<MyPageData.cur_files_data.length;i++)
                {
                    fr = new FileReader();
                    fr.readAsText(MyPageData.cur_files_data[i]);
                    fr.onload = function(e) {
                        var cur_text = fr.result;
                        if(cur_text == null)
                        {
                            console.log("Some wirdeiii");
                        }
                        else{
                            MyPageData.cur_files.push(cur_text);
                            console.log("MyPageData updated");
                            console.log(MyPageData);
                        }
                    };                    
                }
                console.log("Entered upload buttong. Checking whether tf is present");
                load_model(tf).then(function(current_model)
                {
                    window.loaded_model=current_model;
                    console.log("Result from load_model is");
                    console.log(window.loaded_model);
                    console.log("looping through the files");
                    for(i=0; i<MyPageData.cur_files.length;i++)
                    {
                        //fr= new FileReader();
                        //fr.readAsText(window.cur_files[i]);
                        cur_text = MyPageData.cur_files[i];
                        result = is_pii(cur_text, tf, current_model);
                        result.then(function(pii_return_value)
                        { 
                            console.log(pii_return_value);
                            if(pii_return_value===true)
                            {   
                                alert("PII Detected");
                            }
                            else
                            {
                                alert("No PII Detected");
                            }
                        });
                    }
                });
            }// If files length is >0 

        // Cleanup
        MyPageData.cur_files = [];

        }); // End of span click
    })
}
        
define(['base/js/events'], function(events) 
{
    events.on('app_initialized.DashboardApp', function()
    {
        console.log("Entered Dashboard");
        //loadJS("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest");
        //upload_button();
    });

    events.on('draw_notebook_list.NotebookList', function()
    {
        requirejs.config({
            paths: {
                tf: 'tfjs@latest',
            }
            });
        if(MyPageData.js_required==1)
        {
            require(['tf'], function(tf) 
            {
                console.log("After TF JS Loaded and tested");
                alert("TF has been loaded. Please proceed");
                MyPageData.js_required=0;
                upload_button();
                
            });
        }
        
    });
});
