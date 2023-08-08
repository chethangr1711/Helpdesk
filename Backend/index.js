const express = require("express");
const app = express();
// const MongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const jwt = require("jsonwebtoken");

const {Server, server} = require("socket.io");
const io = new Server({
  cors:{
    origin:"*"
  }
});

io.on("connection",(socket)=>{
  console.log("connected");

  

  socket.on("disconnect",() =>{
    console.log("Disconnected");
  })
});
io.listen(4002);

const JWT_SECRET ="Your Secret Code";

const uri = "Your Mongodb Connection String";



app.listen(4001,()=>{
    console.log("Port is working");
}) 


// Create a MongoDB client instance.
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,  
});

//Connect to the database before starting the application server.
(async () => {
  try {
    await client.connect();
    console.log("Connected to the MongoDB database");
  } catch (err) {
    console.error(err);
  }
})();

require("./schema");


app.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    // console.log(email,password);
    try {
        // Use the client instance to access the database collections.
        const db = client.db('Wingslide');
        const usersCollection = db.collection("Users");
    
        // Perform database operations as needed.
        const users = await usersCollection.findOne({ Email:email });
    
        // Send the response to the client.
        if(!users || users.Password !== password){
            return res.json({status:"Invalid Credentials"});
        }
        const token = jwt.sign({ email: users.Email }, JWT_SECRET, { expiresIn: '10h' });


        if(res.status(201)){
            return res.json({data:token, username:users.First_Name})
        }
        else
        {
            return res.json({ error: "error" });
        }
      } catch (err) {
        console.error(err);
        res.json({error:"Internal Server Error"});
      }

});

app.post("/validate", async(req,res)=>{
    const {token} = req.body;
    // console.log(token);
    try {
      const validate = jwt.verify(token,JWT_SECRET);
      // console.log(validate);
      if (!validate) {
        throw new Error("Invalid token");
      }
      res.send({ status: "ok", token:token });
    } catch (error) {
      res.json({error:"Token Expired login again"});
      console.log("Token Expired");
    }
})


app.post("/getticket", async(req,res)=>{
  try {
    const {token} = req.body;
    // console.log(token);
    const db = client.db('Wingslide');
    const usersCollection = db.collection("HelpDeskTicket");

    // Verify token
    const validate = jwt.verify(token, JWT_SECRET);
    //console.log(validate);
    if (!validate) {
      throw new Error("Invalid token");
    }

    // Generate unique ticketId with the format "HD-YYYYMMDD-XXX"
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    
    const latestTicket = await usersCollection.findOne({}, { sort: { TicketID: -1 } });
    const count = latestTicket ? parseInt(latestTicket.TicketID.slice(-3)) + 1 : 1;
    const ticketId = `HD-${year}${month}${day}-${count.toString().padStart(3, '0')}`;

 
    // Check if ticketId already exists in HelpDeskTicket collection
    while (await usersCollection.findOne({ TicketID:ticketId })) {
      count++;
      ticketId = `HD-${year}${month}${day}-${count.toString().padStart(3, '0')}`;
    }

    const usersDetails = db.collection("Users");

    // Perform database operations as needed.
    const users = await usersDetails.findOne({ Email:validate.email });
    // console.log(users);

    const alluser = await usersDetails.find({}, { projection: { First_Name: 1, _id:0,username: 1 } }).toArray(function(err, documents) {
      if (err) {
        console.log('Unable to find documents. Error:', err);
      } else {
        console.log('User names:', documents);
      }
    })
    // console.log(alluser)
    res.send({ status: "ok", data: ticketId, username:users.First_Name, users: alluser });
  } catch (error) {
    res.send({error: error.message || "Failed to create ticket"});
    // console.log("Failed to create ticket:", error);
  }
})



app.post("/createticket", async(req,res)=>{
  // const ticket = mongoose.model("HelpDeskTicket");
  const db = client.db('Wingslide');
  const usersCollection = db.collection("HelpDeskTicket");
  const ticketAuditCollection = db.collection("TicketAudit");
	
  const { title,ticketNum,user,customerName,customerId,email, phone, assignTo, subject,comments,flagc } = req.body;

  const st = "Open";
  const currentDate = new Date();

      
  try {
    
      const doc ={
        Title:title,
        TicketID:ticketNum,
        CustomerID:customerId,
        CustName:customerName,
        Email:email,
        Phone:phone,
        AssignedTo:assignTo,
        CreatedBy:user,
        Subject:subject,
        Comments:comments,
        CreatedAt:currentDate,
        Status:st,
        ClosedAt:null,
        ClosedBy:"",
        UpdatedAt:null,
        UpdatedBy:"",
        UpdatedComment:"",
        ReassignedTo:"",
        flag:flagc,
      }
     
      // console.log(currentDate);
usersCollection.insertOne(doc, function(err,result){
  if(err) throw err;
  console.log("document inserted");
})

  const newaudit = {
    Title:title,
    TicketID:ticketNum,
    CustomerID:customerId,
    CustName:customerName,
    Email:email,
    Phone:phone,
    AssignedTo:assignTo,
    CreatedBy:user,
    Subject:subject,
    Comments:comments,
    CreatedAt:currentDate,
    Status:st,
    ClosedAt:null,
    ClosedBy:"",
    UpdatedAt:null,
    UpdatedBy:"",
    UpdatedComment:comments,
    flag:flagc,
  }

  ticketAuditCollection.insertOne(newaudit, function(err,result){
    if(err) throw err;
    console.log("document inserted");
  })
    // console.log(createrecord);

    io.emit("notifications", `${ticketNum} Ticket Created and Assigned To : ${assignTo}`);
    

    res.send({status:"Ok"});
    // }
    
   
  } catch (error) {
    res.json({error:"Cannot Create a Ticket"});
  }
})



app.post("/getticketrecords", async (req, res) => {
  const { token, type } = req.body;
  const db = client.db("Wingslide");
  const usersCollection = db.collection("Users");
  const ticketCollection = db.collection("HelpDeskTicket");
  try {
    const validate = jwt.verify(token, JWT_SECRET);
    if (!validate) {
      throw new Error("Invalid token");
    }
    
    const users = await usersCollection.findOne({ Email: validate.email });
    const username = users.First_Name;
    const user = await usersCollection.findOne({ First_Name: username });
    const userGroup = user.Group;
    const userPosition = user.Position;

    let query = {
      $and: [
        {
          $or: [
            { CreatedBy: username },
            { AssignedTo: username },
            { ReassignedTo: username },
          ],
        },
        // {
        //   CreatedAt: { $gte: new Date(new Date() - 14 * 24 * 60 * 60 * 1000) },
        // },
      ],
    };

    if (userPosition === "Admin" || userPosition === "Team Lead") {
      delete query.$and[0].$or;
    }

    if (type !== "All") {
  if (userGroup !== "Management") {
    query = {
      $and: [
        {
          $or: [
            { CreatedBy: username },
            { AssignedTo: username },
          ],
        },
        {
          Status: type,
        //   CreatedAt: { $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) },
        },
      ],
    };
  } else {
    query = {
     
      Status: type,
    };
  }
}


    const cursor = ticketCollection.find(query);
    const result = await cursor.toArray();

    if (result.length === 0) {
      res.json({ message: "No records found." });
    } else {
      res.json({ data: result, status: "Ok", username: users.First_Name });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
});


app.get("/Dashboard",async (req, res)=>{
  const token = req.query.token;
  // console.log(token);
  try {

    const db = client.db("Wingslide");
     const ticketCollection = db.collection("HelpDeskTicket");
    
    const validate = jwt.verify(token,JWT_SECRET);
    if (!validate) {
      throw new Error("Invalid token");
    }

    const distinctCustomers = await ticketCollection.distinct('CustName', { Email: { $exists: true }});
    const totalCustomers = distinctCustomers.length;
    const totalTickets = await ticketCollection.countDocuments({});
    const openTicket = await ticketCollection.countDocuments({Status: { $regex: /^open$/i }});
    const closedTicket = await ticketCollection.countDocuments( {Status: { $regex: /^closed$/i }});
    
    // console.log(totalCustomers,totalTickets,openTicket, closedTicket);
    const latestTickets = await ticketCollection
    .find({})
    .sort({ CreatedAt: -1 })
    .limit(5)
    .toArray();


    const lastTicket = await ticketCollection
    .aggregate([
      {
        $match: {
          $or: [
            { UpdatedAt: { $exists: true } },
            { CreatedAt: { $exists: true } },
            { ClosedAt: { $exists: true } },
          ],
        },
      },
      {
        $addFields: {
          latestDate: {
            $max: ["$CreatedAt", "$UpdatedAt", "$ClosedAt"],
          },
        },
      },
      {
        $sort: {
          latestDate: -1,
        },
      },
      {
        $limit: 1,
      },
    ])
    .toArray();


    // console.log(lastTicket);
    res.send({ status: "ok", customers:totalCustomers,tickets:totalTickets, open:openTicket,closed:closedTicket, latestTickets: latestTickets, lastTicket:lastTicket });
  } catch (error) {
    res.json({error:"Token Expired login again"});
    // console.log("Token Expired");
  }
})



app.get('/customerdata', async(req,res)=>{
  const token = req.query.token;
  // console.log(token);
  try {
    const db = client.db("Wingslide");
    const ticketCollection = db.collection("HelpDeskTicket");
   
   const validate = jwt.verify(token,JWT_SECRET);
   if (!validate) {
     throw new Error("Invalid token");
   }

   const result = await ticketCollection.find({}, {projection : {TicketID:1,CustomerID:1,CustName:1,Email:1,Phone:1}}).toArray();
  //  console.log(result);
   res.json({data:result , status:"Ok"});
  } catch (error) {
    console.log(error);
    res.json({error:"Login Expired!!! Please Login Again"})
  }
})

app.post('/updateTicket', async (req, res) => {
  const { token, TID, st, comments, closedby, reassignedto,priority,title,subject,phoneno } = req.body;
  let closeddate = null;
  let updatedate = new Date();
  const newupdatedate = new Date();
  try {
    const db = client.db("Wingslide");
    const ticketCollection = db.collection("HelpDeskTicket");
    const ticketAuditCollection = db.collection("TicketAudit");
    const validate = jwt.verify(token, JWT_SECRET);
    if (!validate) {
      throw new Error("Invalid token");
    }
    if (st === 'Closed') {
      closeddate = new Date();
      updatedate = null;
    }

    const usersDetails = db.collection("Users");

    const users = await usersDetails.findOne({ Email: validate.email });

    const updateFields = {
      Subject:subject,
      Phone:phoneno,
      Status: st,
      Title:title,
      ClosedAt: closeddate,
      UpdatedAt: updatedate,
      ClosedBy: users.First_Name,
      UpdatedBy: users.First_Name,
      UpdatedStatus: st,
      UpdatedComment: comments,
       ReassignedTo: reassignedto,
      flag:priority,
    };
    

    if (reassignedto) {
      updateFields.AssignedTo = reassignedto;
    }

    const result = await ticketCollection.findOneAndUpdate(
      { TicketID: TID },
      { $set: updateFields },
      { returnOriginal: false }
    );

    const tDetials = await ticketCollection.findOne({TicketID: TID});
    const ticketaudit ={
      Title:tDetials.Title,
      TicketID:tDetials.TicketID,
      CustomerID:tDetials.CustomerID,
      CustName:tDetials.CustName,
      Email:tDetials.Email,
      Phone:tDetials.Phone,
      AssignedTo:tDetials.AssignedTo,
      CreatedBy:tDetials.CreatedBy,
      Subject:tDetials.Subject,
      Comments:tDetials.Comments,
      CreatedAt:tDetials.CreatedAt,
      Status:tDetials.Status,
      ClosedAt:tDetials.ClosedAt,
      ClosedBy:tDetials.ClosedBy,
      UpdatedAt:newupdatedate,
      UpdatedBy:users.username,
      UpdatedComment:comments,
      UpdatedStatus:st,
      ReassignedTo:reassignedto,
      flag:priority,
    }
   
    // console.log(currentDate);
    ticketAuditCollection.insertOne(ticketaudit, function(err,result){
      if(err) throw err;
      console.log("document inserted");
    })


    // console.log(ticketaudit);

    if (result.value) {
      // io.emit("notifications", {ticketid:TID,message: "Updated Successfully"});
      io.emit("notifications",`${TID} Ticket has been modified by : ${users.First_Name}`);
      res.json({ success: true });
    } else {
      res.json({ success: false, error: "Ticket Not Found" });
    }
  } catch (error) {
    res.json({ error: "Internal Server Error" });
  }
});



app.get('/getrecord', async(req,res)=>{
  const { ticketNumber } = req.query;
  const token = req.headers.authorization.split(' ')[1];
  // console.log(ticketNumber, token);
  const db = client.db('Wingslide');
  const usersCollection = db.collection("Users");
  const ticketAuditCollection = db.collection("TicketAudit");
  try {
    const validate = jwt.verify(token, JWT_SECRET);
    if (!validate) {
      throw new Error("Invalid token");
    }
    const users = await usersCollection.findOne({ Email: validate.email });
    if (users.Group === 'Admin' || users.Group === 'Management' || users.Position === 'Team Lead') {
      const regexPattern = new RegExp(ticketNumber, 'i');
      const query = {
        $or: [
          { TicketID: ticketNumber },
          { Title: { $regex: regexPattern } }
        ]
      };
      const result = await ticketAuditCollection.find(query).toArray();
      if (result.length === 0) {
        return res.json({ error: `${ticketNumber} Ticket not found. Please check Ticket Number or Business Name` });
      }
      return res.json({ data: result, status: "Ok" });
    } else {
      return res.json({ error: "You don't have permission to view it" });
    }
  } catch (error) {
    return res.json({ error: "Internal Server Error" });
  }
})



app.get('/viewTicket',async(req,res)=>{
  const token = req.query.token;

  // console.log(token);
  const db = client.db('Wingslide');
  const usersCollection = db.collection("Users");
  const ticketCollection = db.collection("HelpDeskTicket");
  
  try {
    const validate = jwt.verify(token, JWT_SECRET);
    if (!validate) {
      throw new Error("Invalid / Token Expired");
    }
    const users = await usersCollection.findOne({ Email:validate.email });
    
    const result = await usersCollection.find({},{ projection: { username: 1, _id: 1,First_Name:1 } }).toArray();
    
const totalInprocess = await ticketCollection.countDocuments({
  $and: [
    {
      $or: [
        { AssignedTo: users.First_Name },
        { ReassignedTo: users.First_Name }
      ]
    },
    { Status: "In Process" }
  ]
});
// console.log(totalInprocess);


    
    return res.json({ status:"Ok", username:users.username, allusers:result, isAdmin:users.Position ,isPaused:users.isPaused,inprocess:totalInprocess});
    // console.log(users.isPaused);

  } catch (error) {
    console.log("Internal Server Error");
  }
})



app.get('/getProfile',async(req,res)=>{
  const token = req.query.token;

 
  const db = client.db('Wingslide');
  const usersCollection = db.collection("Users");
  const ticketCollection = db.collection("HelpDeskTicket");
  
  try {
    const validate = jwt.verify(token, JWT_SECRET);
    if (!validate) {
      throw new Error("Invalid / Token Expired");
    }
    
    const users = await usersCollection.findOne({ Email:validate.email });
    
    let isAdmin = false;
    if(users.Position === 'Admin'){
        isAdmin =true;
        
    }
    
     const allusers = await usersCollection.find({}).toArray();


    return res.json({ status:"Ok", username:users,allusers:allusers,admin:isAdmin});
    // console.log(users.isPaused);

  } catch (error) {
    console.log("Internal Server Error");
  }
})


app.post('/changepass', async (req, res) => {
  const { token, newPassword, Email } = req.body;

  const db = client.db('Wingslide');
  const usersCollection = db.collection('Users');

  try {
    const validate = jwt.verify(token, JWT_SECRET);
    if (!validate) {
      throw new Error('Invalid / Token Expired');
    }

    // Find the user based on the Email
    const user = await usersCollection.findOne({ Email });
    if (!user) {
      throw new Error('User not found');
    }

    // Update the user's password
    await usersCollection.updateOne({ _id: user._id }, { $set: { Password: newPassword } });

    return res.json({ status: 'Password updated successfully' });
  } catch (error) {
    console.log('Internal Server Error');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



process.on("SIGINT", () => {
    client.close().then(() => {
      console.log("MongoDB connection closed");
      server.close();
    });
  });
