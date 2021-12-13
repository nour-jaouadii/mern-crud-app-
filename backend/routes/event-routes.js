const express = require('express');
const Event = require('../models/event');

const router = express.Router();
const auth = require('../middleware/auth')

let teachers =[
    {id: 1 , name: 'abderahmen' , email: 'ab@croco.com'},
    {id: 2 , name: 'amin' , email: 'amin@croco.com'}

];
// events 
// Business Logic to Add  Event

router.post('/',auth, (req,res)=>{
    console.log('Here into Add event', req.body);
    const Event1 = new Event({
        teacherId: 1,
        name: req.body.name,
        price:req.body.price,
        date: req.body.date,
        description :req.body.description
       });
       Event1.save().then(response => {
         console.log('adding Event with success');
         res.status(200).json(
          {
            message:'Event added successFuly',
            event: response
        }
         )
       }).catch(error =>{
         console.log('error with data ', error);
       });
})
// Business Logic to get  all  Event
router.get('/',(req,res)=>{
    console.log('here into get all Event');
    Event.find((error,docs)=>{
        if(error){
            console.log('Error with db');
        }else{
            // Res : Array OF Object
            res.status(200).json({
                events: docs
            });
        }
    })
})
// Business Logic to get all teacher Event by ID

router.get('/allteacherevents/:teacherId',(req,res)=>{
    console.log('Here into get Event By Id ', req.params.teacherId);
    Event.find({teacherId:req.params.teacherId}).then(result => {
        console.log('Here result after find by id', result);
        res.status(200).json(
            {
              message:'Event added successFuly',
              event : result
          });
         })
    .catch(error =>{
        console.log('error with data ', error ,'not found ID"');
        res.status(200).json(
            {
              message:'not found ID',
          });
      });

});
// Business Logic to get Event by ID

router.get('/:id',(req,res)=>{
    console.log('Here into get Event By Id ', req.params.id);
    Event.findOne({_id:req.params.id}).then(result => {
        console.log('Here result after find by id', result);
        res.status(200).json(
            {
              message:'Event by Id = ',
              findedEvent: result
          });
         })
    .catch(error =>{
        console.log('error with data ', error ,'not found ID"');
        res.status(200).json(
            {
              message:'not found ID',
          });
      });

});

//  Bl to update event by IS
router.put('/:id',(req,res)=>{
    console.log('Here into edit event By Id ', req.params.id);
    

    Event.updateOne({_id:req.params.id}, req.body ).then(result => {
        console.log(result);
        if(result.n == 1 ){
            console.log('Here result after find by id', result);
            res.status(200).json(
                {
                message:'Event Updated successFuly',
                event: result
              });
        }else{
            res.status(200).json(
                {
                  message:'Event Does not exist ',
                  event: result
              });
         }

        }).catch(error =>{
            console.log('error with data ', error ,'not found ID');
            res.status(200).json(
                {
                  message:'not found ID',
                  event: error
              });
          });
      // end Update one   
     }); //  end function

//  Bl to delete Event
router.delete('/:id',(req,res)=>{
console.log('Here into delete Event By Id ', req.params.id);


Event.deleteOne({_id:req.params.id}).then(result => {
    
    if(result ){
    
        console.log('Here result delete by id', result);
        Event.find().then(
            (event)=>{
                res.status(200).json(
                    {
                    events:event,
                    message:'Event deleted successFuly',
                 });
            }
        );
    }else {
        res.status(200).json(
            {
                message: ' no Event  ',  
                   });
        }
    }).catch(error =>{
        console.log('error with data ', error ,'not found ID');
        res.status(200).json(
            {
                message:'not found ID',
                event: error
            });
        });
        
    });

    module.exports = router;