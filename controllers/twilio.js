const twilio = require('twilio');
const Feedback = require('../model/feedback');
const Reservation = require('../model/reservation'); // Assuming you have a model for room reservations


const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);




const FAQ_OPTIONS = `
Please select a FAQ:

1. Cancellation policy
2. Payment methods
3. Pet policy
`;

const SUITE_OPTIONS = `
Please select a Suite:

1. Deluxe
2. Presidential
3. Executive
`;

// In-memory sessions
const sessions = {};

function cancelSession(from) {
  delete sessions[from];
}




const whatsapp_Response = async (req, res) => {

  const userName = req.body.ProfileName || 'User'

  
const MENU_OPTIONS = `
Hello, ${userName} Welcome! How may I assist you today?

A. Room Reservations 
B. View Amenities  
C. Special Offers  
D. Check-In Process 
E. Check-Out Process 
F. Contact 
G. FAQs
H. Feedback
I.  Cancel Reservation

`;

  try {
    const { Body, From  } = req.body;
    const bodyLower = Body ? Body.toLowerCase().trim() : '';
    let responseMessage = '';

    // Initialize session if not exists
    if (!sessions[From]) {
      sessions[From] = { step: 0 };
    }
    const session = sessions[From];


     // Handle exit or cancel request first
     if (bodyLower === 'cancel' || bodyLower === 'exit') {
      cancelSession(From);
      responseMessage = MENU_OPTIONS; // Provide the menu options after cancellation
      return res.status(200).send({ message: responseMessage })
    }
  

    switch (session.step) {
      case 0: // Initial greeting
        if (bodyLower === 'hi' || bodyLower === 'hello') {
          responseMessage = MENU_OPTIONS;
          session.step = 1; // Move to the menu options step
        } else {
          responseMessage = 'Please reply with "hi" to see the menu options.';
        }
        break;

      case 1: // User has chosen a menu option
        switch (bodyLower) {
          case 'a':
            responseMessage = 'Please provide your name for the room reservation.';
            session.step = 2; // Move to the next step
            break;
          case 'b':
            responseMessage = 'Our amenities include: Free Wi-Fi, Restaurant, laundry.';
            session.step = 0; // Reset after providing info
            break;
          case 'c':
            responseMessage = 'Check out our special offers on our website or ask for details from 08170212091';
            session.step = 0; // Reset after providing info
            break;
          case 'd':
            responseMessage = 'The check-in process starts anytime, if you have a reservation. Please bring your ID and confirmation.';
            session.step = 0; // Reset after providing info
            break;
          case 'e':
            responseMessage = 'Check-out time is 12 PM. Let us know if you need a late check-out.';
            session.step = 0; // Reset after providing info
            break;
          case 'f':
            responseMessage = 'You can contact us at 08170212091 or email nwosuchris5@gmail.com.';
            session.step = 0; // Reset after providing info
            break;
          case 'g':
            responseMessage = FAQ_OPTIONS;
            session.step = 10; // Move to FAQ options
            break;
          case 'h':
            responseMessage = 'Please provide your name for feedback comment.';
            session.step = 11; // Move to feedback name step
            break;
          case 'i':
            responseMessage = 'Enter your name to cancel your reservation.';
            session.step = 14; // Reset after providing info
              break;
          default:
            responseMessage = 'I didn’t understand that. Please reply with "hi" to see the menu options again.';
            session.step = 0;
        }
        break;

      case 10: // User selects a FAQ option
        switch (bodyLower) {
          case '1':
            responseMessage = 'Our cancellation policy allows you to cancel free of charge up to 48 hours before your check-in date.';
            session.step = 0; // Reset after providing info
            break;
          case '2':
            responseMessage = 'We accept cards, transfers, and cash for payment.';
            session.step = 0; // Reset after providing info
            break;
          case '3':
            responseMessage = 'We do not allow pets. Please be informed in advance.';
            session.step = 0; // Reset after providing info
            break;
          default:
            responseMessage = 'I didn’t understand that. Please select a valid FAQ option (1, 2, or 3).';
            break;
        }
        break;

      case 2: // User provides their name
        session.name = Body; // Save user's name
        responseMessage = `Thank you, ${session.name}! Please provide your phone number.`;
        session.step = 3; // Move to the next step
        break;

      case 3: // User provides phone number
        const isValidateMobile = (phone) => {
          const regex = /^\+?\d{1,3}[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;
          return regex.test(phone);
        };

        if (isValidateMobile(bodyLower)) {
          session.phone = bodyLower; // Save user's phone number
          responseMessage = 'When would you like to check in? Please provide the date (YYYY-MM-DD)';
          session.step = 4; // Move to the next step
        } else {
          responseMessage = 'Please provide a valid phone number.';
        }
        break; // Fixed to ensure step stays the same if invalid input

      case 4: // User provides check-in date
        const isValidDate = (checkInDate) => {
          const regex = /^\d{4}-\d{2}-\d{2}$/;
          return regex.test(checkInDate) && !isNaN(new Date(checkInDate).getTime());
        };

        if (isValidDate(bodyLower)) {
          const checkInDate = new Date(bodyLower);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set time to the start of the day
      
          if (checkInDate >= today) {
              session.checkInDate = bodyLower; // Save check-in date
              responseMessage = SUITE_OPTIONS; // Show suite options
              session.step = 5; // Move to the next step
          } else {
              responseMessage = 'Please provide a check-in date that is today or in the future.';
          }
      } else {
          responseMessage = 'Please provide a valid check-in date in YYYY-MM-DD format.';
      }
      break

      case 5: // User selects a suite
        switch (bodyLower) {
          case '1':
            session.suite = 'Deluxe,\nPrice for a night - N25000';
            break;
          case '2':
            session.suite = 'Presidential,\nPrice for a night - N40000';
            break;
          case '3':
            session.suite = 'Executive,\nPrice for a night - N35000';
            break;
          default:
            responseMessage = 'I didn’t understand that. Please select a valid suite option (1, 2, or 3).';
            break;
        }
        if (!responseMessage) {
          responseMessage = `You selected ${session.suite}. How many nights would you like to stay?`;
          session.step = 6; // Move to the next step
        }
        break;

      case 6: // User provides number of nights
        const nightsInput = parseInt(bodyLower, 10);
        if (isNaN(nightsInput) || nightsInput <= 0) {
          responseMessage = 'Please enter a valid number of nights (e.g., 1, 2, 3).';
        } else {
          session.nights = nightsInput; // Save number of nights

          // Save reservation to MongoDB
          const reservation = new Reservation({
            name: session.name,
            phoneNumber: session.phone,
            checkInDate: session.checkInDate,
            suite: session.suite,
            nights: session.nights
          });
          await reservation.save();

          responseMessage = `Your reservation for ${session.suite} , from ${session.checkInDate} for ${session.nights} night(s) is confirmed! Thank you for choosing us!`;
          delete sessions[From]; // Remove session after confirmation
        }
        break;

      case 11: // User provides their name for feedback
        session.name = Body; // Save user's feedback name
        responseMessage = `Thank you, ${session.name}! Please enter your feedback comment.`;
        session.step = 12; // Move to next step to get comment
        break;

      case 12: // User provides their feedback comment
        session.comment = bodyLower.trim(); // Save user's feedback comment
        responseMessage = `Thank you for your feedback. Please provide your phone number for further communication.`;
        session.step = 13; // Move to the next step to get the phone number
        break;

      case 13: // User provides their phone number
        const isValidatePhone = (phone) => {
          const regex = /^\+?\d{1,3}[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;
          return regex.test(phone);
        };

        if (isValidatePhone(bodyLower)) {
          session.phone = bodyLower; // Save user's phone number
 // Save user's phone number
          const feedback = new Feedback({
            name: session.name,
            comment: session.comment,
            phone: session.phone,
          });
          await feedback.save();
          responseMessage = 'We appreciate your feedback! Thank you!';
          delete sessions[From]; // Remove session after saving feedback
          session.step = 0; // Reset session after feedback
        } else {
          responseMessage = 'Please provide a valid phone number.';
        }
        break; 
      case 14:
        session.name = bodyLower
        const findUser = await Reservation.findOne({name: session.name})
        if(findUser){
          await Reservation.deleteOne({name : session.name})
          responseMessage = 'Reservation cancelled successfully. Thanks for your patronage!'
          delete sessions[From]; // Remove session after saving feedback
          session.step = 0;
        } else {
           responseMessage = `No reservation exist for ${session.name} `
           session.step = 0;
        }
        break; 
      default:
        responseMessage = 'Session expired or invalid state. Please reply "hi" to restart.';
        session.step = 0; // Reset session
        break;
    }
    // Send response back to user
    await twilioClient.messages.create({
      body: responseMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: From
    });


  //res.send(`<Response><Message>${responseMessage}</Message></Response>`); // Twilio requires a response
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  whatsapp_Response,
};
