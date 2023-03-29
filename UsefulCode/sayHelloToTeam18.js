'use strict';

export const handler = async(event) => {
    //TODO
    let team_members = ["Ali Al Hamadani", "William Boafo", "Ryan Brown", "William Perkin", "Jorge Pezo", "Neil Thakur"];
    let team_members_netIDs = ["aha19004", "wib17006", "rwb18003", "wap21001", "jcp20007", "nmt18004", "mst23001"];
    let tmp_netID = "";
    let responseCode = 200;
    console.log("request: " + JSON.stringify(event));
    
   if (event.queryStringParameters && event.queryStringParameters.netID) 
   {
       console.log("Received netID: " + event.queryStringParameters.netID);
       tmp_netID = event.queryStringParameters.netID;
   }
   
   let returnMessage = "";
   
   if (team_members_netIDs.includes(tmp_netID)) 
   {
       returnMessage = "this message was brought to you by the global leader in cloud infrastructure and platform services";
   }
   else
   {
       returnMessage = "invalid netID";
   }
   
   if(tmp_netID === "kmt20013")
   {
       returnMessage = "hey Krish!";
   }
   
   if(tmp_netID === "src19001")
   {
       returnMessage = "hey Shahzaib!";
   }
   
   if(tmp_netID === "Brinda")
   {
       returnMessage = "hello meri jaan <3";
   }
   
   if(tmp_netID === "demoForJorge")
   {
       returnMessage = "carbohydrates = 80g";
   }
   
   let responseBody = 
   {
       message: returnMessage
       //input: event
       
   };
   
   let response =
   {
       statusCode: responseCode,
       headers: 
       {
           "neil-custom-header":"neil-custom-value-69 :D"
       },
       body: JSON.stringify(responseBody)
   };
   
   console.log("response: " + JSON.stringify(responseBody));
   return response;
};
