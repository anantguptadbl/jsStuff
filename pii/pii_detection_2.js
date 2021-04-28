var current_model;
var vocab_dict;

function load_model()
{
    console.log("Loading the model");
    // Load the model
    const MODEL_URL = 'http://127.0.0.1:8000/pii_model_20210426_tfjs/model.json';
    async function start()
    {
        current_model = await tf.loadLayersModel(MODEL_URL);
        console.log("Model has been loaded");
        console.log(current_model);
    }
    start();
    vocab_dict={};
}

function is_pii(input_tensor)
{
    var final_result = new Promise(function(resolve, reject)
    {
        console.log("Data passed");
        console.log(current_model);
        result = current_model.predict(input_tensor);
        result.array().then
        (
            array => {
                //console.log(array[0][0]);
                //console.log(array[0][0] > 0.5);
            if(array[0][0] > 0.5) 
            { 
                window.final_prediction=true;
            } 
            else 
            { 
                window.final_prediction=false;
            }
            //console.log("In the pii functionm");
            
            resolve(window.final_prediction);
            
        });
    })
    return final_result;
}