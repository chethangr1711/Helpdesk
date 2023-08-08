const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://animationdesign2015:ODGQjC5K1Y0JBILA@wingslidecluster.kmshtrq.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });


const userSchema = new mongoose.Schema({
    User_Id:{type:String,unique:true},
    First_Name:String,
    Last_Name:String,
    Email:{type:String,unique:true},
    Password:String,
    Group:String,
    Position:String
},
{
    collection:"Users"
}
);

mongoose.model("Users",userSchema)

const HelpDeskTicket = new mongoose.Schema({
    TicketID:{type:String,unique:true},
    Title:String,
    CustomerID:String,
    CustName:String,
    Email:String,
    Phone:Number,
    AssignedTo:String,
    CreatedBy:String,
    Subject:String,
    Comments:String,
},
{
    collection:"HelpDeskTicket",
    db:"Wingslide"
}
);

mongoose.model("HelpDeskTicket",HelpDeskTicket)