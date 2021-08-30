// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const { MessageFactory } = require('botbuilder');
const { ActionTypes } = require('botframework-schema');
const Recognizers = require('@microsoft/recognizers-text-suite');
const CONVERSATION_FLOW_PROPERTY = 'CONVERSATION_FLOW_PROPERTY';
const USER_PROFILE_PROPERTY = 'USER_PROFILE_PROPERTY';

const question = {
    none: 'none',
    preferredName: 'preferredName',
    urgency: 'urgency',
    foundForm: 'foundForm',
    location: 'location', 
    age: 'age',
    fullName: 'fullName',
    birthdate: 'bithdate',
    gender: 'gender',
    healthcard: 'healthcard',
    streetAddress: 'streetAddress',
    city: 'city',
    postalCode: 'postalCode',
    expandedConcerns: 'expandedConcerns',
    concernsBegan: 'concernsBegan',
    suicideProblem: 'suicideProblem',
    preferredMentalHealthServices: 'preferredMentalHealthServices',
    physicalDisability: 'phyicalDisability',
    primaryContactMethod: 'primaryContactMethod',
    phoneNumber: 'phoneNumber',
    eMail: 'eMail',
    voiceMessageConsent: 'voiceMessageConsent',
    textMessageConsent: 'textMessageConsent',
    bestContactTime: 'bestContactTime',
    guardianFormAwareness: 'guardianFormAwareness',
    guardianContactConsent: 'guardianContact',
    guardianName: 'guardianFirstName',
    guardianRelationship: 'guardianRelationship',
    guardianContactMethod: 'guardianContactInfo',
    guardianPhoneNumber: 'guardianPhoneNumber',
    guardianEmail: 'guardianEmail',
    guardianNoContactExplained: 'guardianNoContactExplained',

    reliableAdultSupport: 'reliableAdultSupport',
    highestEducationLevel: 'highestEducationLevel',
    isIndigenous: 'isIndigenous',
    originDescription: 'originDescription',
    livingSituation: 'livingSituation',
    currentSituation: 'currentSituation',
    additionalQuestions: 'additionalQuestions',

    trappedFeelings: 'trappedFeelings',
    sleepTrouble: 'sleepTrouble',
    anxiousTrouble: 'anxiousTrouble',
    distressedTrouble: 'distressedTrouble',
    adultSuicideTrouble: 'adultSuicideTrouble',
    visualAudioTrouble: 'visualAudioTrouble',
    attentionTrouble: 'attentionTrouble',
    alcoholDrugsTrouble: 'alcoholDrugsTrouble',
    alcoholDrugsEffect: 'alcoholDrugsEffect',
    physicalConflict: 'physicalConflict',
    missingMealTrouble: 'missingMealTrouble',
    bingeEatingTrouble: 'bingeEatingTrouble',
    disturbingDreamTrouble: 'disturbingDreamTrouble',
    beingWatchedTrouble: 'beingWatchedTrouble',
    internetTrouble: 'internetTrouble',
    gamblingTrouble: 'gamblingTrouble',
    pastHealthServicesReceived: 'pastHealthServicesReceived',
    currentMentalHealthHospitalizationStatus: 'currentMentalHealthHospitalizationStatus',
    adultPhysicalDisability: 'adultPhysicalDisability',
    hasFamilyDoctor: 'hasFamilyDoctor',
    citizenship: 'citizenship',
    sexualOrientation: 'sexualOrientation',
    livingWith: 'livingWith',
    getAlongLivingWith: 'getAlongLivingWith', 
    householdIncome: 'householdIncome',


    fillFeedbackForm: 'fillFeedbackForm',
    submitForm: 'submitForm',
    displayInfo: 'displayInfo',
    endScreen: 'endScreen',
};

// profile variables 
/* 
    1. profile.preferredName
    2. profile.urgency
    3. profile.foundForm
    4. profile.location
    5. profile.age
    6. profile.fullName
    7. profile.birthdate
    8. profile.gender
    9. profile.healthCardNumber
    10. profile.streetAddress
    11. profile.city
    12. profile.postalCode
    13. profile.expandedConcerns
    14. profile.concernsBegan
    15. profile.suicideProblem
    16. profile.preferredMentalHealthServices
    17. profile.physicalDisability
    18. profile.primaryContactMethod
    19. profile.phoneNumber
    20. profile.email
    21. profile.voiceMessageConsent
    22. profile.textMessageConsent
    23. profile.bestContactTime
    24. profile.guardianFormAwareness
    25. profile.canContactGuardian
    26. profile.guardianName
    27. profile.guardianRelationship
    28. profile.guardianContactMethod
    29. profile.guardianPhone
    30. profile.guardianEmail
    31. profile.guardianNoContactExplained
    32. profile.reliableAdultSupport
    33. profile.highestEducationLevel
    34. profile.isIndigenous
    35. profile.origin
    36. profile.livingSituation
    37. profile.currentSituation
    38. profile.additionalQuestions
    39. profile.fillFeedbackForm
    40. profile.trappedFeelings
    41. profile.sleepTrouble
    42. profile.anxiousTrouble
    43. profile.distressedTrouble
    44. profile.visualAudioTrouble
    45. profile.attentionTrouble
    46. profile.alcoholDrugsTrouble
    47. profile.alcoholDrugsEffect
    48. profile.physicalConflict
    49. profile.missingMealTrouble
    50. profile.bingeEatingTrouble
    51. profile.disturbingDreamTrouble
    52. profile.beingWatchedTrouble
    53. profile.internetTrouble
    54. profile.gamblingTrouble
    55. profile.pastHealthServicesReceived
    56. profile.currentMentalHealthHospitalizationStatus
    57. profile.hasFamilyDoctor
    58. profile.citizenship
    59. profile.sexualOrientation
    60. profile.livingWith 
    61. profile.getAlongLivingWith
    62. profile.householdIncome
*/

class ReferralBot extends ActivityHandler {
    constructor(conversationState, userState, myStorage) {
        super();

        this.conversationFlow = conversationState.createProperty(CONVERSATION_FLOW_PROPERTY);
        this.userProfile = userState.createProperty(USER_PROFILE_PROPERTY);


        // The state management objects for the conversation and user.
        this.myStorage = myStorage; 
        this.conversationState = conversationState;
        this.userState = userState;


        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeMessage = "Hi! I’m [name], a chatbot designed by the people over at the Youth Mental Health and Technology to help you get a referral to mental health services. Please note that I am not a therapist, and I am not an emergency service. If you are in a crisis situation, call 9-1-1. You can also type “help” at any time to get a list of resources. I’m going to be asking you some questions that will help me get you the service you need. Don’t worry, though; everything you tell me is 100% confidential and secure. Remember, everything you tell me will help me get you the best care possible, so please be honest with me. If you ready to get started, please enter anything."; 
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(welcomeMessage); 
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
        this.onMessage(async (turnContext, next) => {
            const userResponse = turnContext.activity.text;
            const flow = await this.conversationFlow.get(turnContext, { lastQuestionAsked: question.none });
            const profile = await this.userProfile.get(turnContext, {});

            await ReferralBot.userDialogPathway(flow, profile, turnContext, userResponse);

            await next(); 
        })
    }

    async run(context) {
        await super.run(context);
        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }

    static async userDialogPathway(flow, profile, turnContext, userResponse) {
        let result; 
        switch(flow.lastQuestionAsked) {
            case question.none: 
                await turnContext.sendActivity("Let's get started. What is your name?");
                flow.lastQuestionAsked = question.preferredName;
                break;
            
            case question.preferredName: 
                profile.preferredName = userResponse; 
                const urgencyMessage = "How urgent is your situation?"; 
                await ReferralBot.sendSuggestedUrgencyActions(turnContext, urgencyMessage); 
                flow.lastQuestionAsked = question.urgency; 
                break;

            case question.urgency: 
                profile.urgency = userResponse;
                if (profile.urgency != 'Not Urgent') {
                    const urgentSituationMessage = "Please note that this referral service is not an emergency service. If there is an urgent situation (for example, losing control of aggressive or suicidal thoughts), please call 9-1-1 or go to the nearest emergency department."
                    await turnContext.sendActivity(urgentSituationMessage); 
                }
                const foundFormMessage = "How did you find out about this form?";
                await ReferralBot.sendSuggestedFoundFormActions(turnContext,foundFormMessage);
                flow.lastQuestionAsked = question.foundForm; 
                break; 
            
            case question.foundForm: 
                profile.foundForm = userResponse; 
                const locationMessage = "Where are you located?"; 
                await ReferralBot.sendSuggestedLocationActions(turnContext, locationMessage); 
                flow.lastQuestionAsked = question.location; 
                break; 
            
            case question.location: 
                profile.location = userResponse; 
                if (profile.location == 'Other') {
                    ReferralBot.sendEndMessage(turnContext); 
                    flow.lastQuestionAsked = question.endScreen;
                    break
                }
                await turnContext.sendActivity("I'm happy to let you know that this referral service is available in your community! Let's proceed! ");
                await turnContext.sendActivity("How old are you " + profile.preferredName + "?");
                flow.lastQuestionAsked = question.age; 
                break;
            
            case question.age: 
                result = this.validateAge(userResponse);
                if (result.success) {
                    profile.age = result.age;
                    if (profile.age < 11 || profile.age > 25) {
                        ReferralBot.sendEndMessage(turnContext); 
                        flow.lastQuestionAsked = question.endScreen; 
                        break; 
                    } else {
                        await turnContext.sendActivity("What is your full legal first name including your middle initial if necessary?");
                        flow.lastQuestionAsked = question.fullName;
                        break;
                    }
                } else {
                    // If we couldn't interpret their input, ask them for it again.
                    // Don't update the conversation flag, so that we repeat this step.
                    await turnContext.sendActivity(result.message || "I'm sorry, I didn't understand that.");
                    break;
                }
            
            case question.fullName: 
                profile.fullName = userResponse; 
                await turnContext.sendActivity("What is your birth date in MM/DD/YYYY format?");
                flow.lastQuestionAsked = question.birthdate; 
                break;
                
            case question.birthdate: 
                profile.birthdate = userResponse; 
                const genderMessage = "What gender do you identify as?"
                await ReferralBot.sendSuggestedGenderActions(turnContext, genderMessage);
                flow.lastQuestionAsked = question.gender; 
                break; 
                 
            case question.gender:    
                profile.gender = userResponse; 
                await turnContext.sendActivity("Note that this field is optional. If you would like to, please enter your health card number. If not, please enter the digit 1. "); 
                flow.lastQuestionAsked = question.healthCard; 
                break; 
            
            case question.healthCard: 
                profile.healthCardNumber = userResponse; 
                await turnContext.sendActivity("Please enter your street address"); 
                flow.lastQuestionAsked = question.streetAddress; 
                break; 
            
            case question.streetAddress: 
                profile.streetAddress = userResponse; 
                await turnContext.sendActivity("What city do you live in?"); 
                flow.lastQuestionAsked = question.city; 
                break; 

            case question.city:
                profile.city = userResponse; 
                await turnContext.sendActivity("Please enter your postal code");
                flow.lastQuestionAsked = question.postalCode; 
                break; 
            
            case question.postalCode: 
                profile.postalCode = userResponse; 
                await turnContext.sendActivity("I'd love to hear more about your concerns that brought you to me today. I know you said your situation was " + profile.urgency.toLowerCase() + " so any extra details would be amazing!"); 
                flow.lastQuestionAsked = question.expandedConcerns; 
                break; 
            
            case question.expandedConcerns: 
                profile.expandedConcerns = userResponse; 
                const concernsBeganMessage = "I'm sorry to hear that " + profile.preferredName + ". Could you tell me when these concerns began?"; 
                await ReferralBot.sendSuggestedConcernsBeganActions(turnContext, concernsBeganMessage); 
                flow.lastQuestionAsked = question.concernsBegan; 
                break; 

            case question.concernsBegan: 
                profile.concernsBegan = userResponse; 
                await turnContext.sendActivity("Have you had any significant problems with thinking about ending your life or commiting suicide?"); 
                flow.lastQuestionAsked = question.suicideProblem; 
                break; 
            
            case question.suicideProblem: 
                profile.suicideProblem = userResponse; 
                const typeMentalHealthServices = "What type of mental health services are you looking to receive?"; 
                await ReferralBot.sendSuggestedPreferredMentalHealthServicesActions(turnContext, typeMentalHealthServices); 
                flow.lastQuestionAsked = question.preferredMentalHealthServices; 
                break; 
            
            case question.preferredMentalHealthServices: 
                profile.preferredMentalHealthServices = userResponse; 
                await turnContext.sendActivity("Do you have any physical disability or any physical health concern? If so, please elaborate."); 
                flow.lastQuestionAsked = question.physicalDisability; 
                break; 
            
            case question.physicalDisability: 
                profile.physicalDisability = userResponse; 
                const contactMethods = "What is the best way to contact you?"
                await ReferralBot.sendSuggestedContactMethodActions(turnContext, contactMethods); 
                flow.lastQuestionAsked = question.primaryContactMethod; 
                break; 
            
            case question.primaryContactMethod: 
                profile.primaryContactMethod = userResponse;
                const contactMethods2 = "What is the best way to contact you?" 
                if (profile.primaryContactMethod == "Phone Call") {
                    await turnContext.sendActivity("Please enter your phone number"); 
                    flow.lastQuestionAsked = question.phoneNumber; 
                } else if (profile.primaryContactMethod == "Text") {
                    await turnContext.sendActivity("Please enter your phone number"); 
                    flow.lastQuestionAsked = question.phoneNumber; 
                } else if (profile.primaryContactMethod == "E-mail") {
                    await turnContext.sendActivity("Pleas enter your e-mail"); 
                    flow.lastQuestionAsked = question.eMail;
                } else {
                    await turnContext.sendActivity("Sorry, please select one of the given options.");
                    await turnContext.sendActivity("What is the best way to contact you?"); 
                    await ReferralBot.sendSuggestedContactMethodActions(turnContext, contactMethods2); 
                }
                break; 
            
            case question.phoneNumber: 
                profile.phoneNumber = userResponse; 
                profile.email = "No Email Given"; 
                const voiceMessageConsentMessage = "Is it okay if we leave a voice mail at the number you've given me?"; 
                await ReferralBot.sendSuggestedVoiceMessageConsentActions(turnContext, voiceMessageConsentMessage); 
                flow.lastQuestionAsked = question.voiceMessageConsent;
                break; 

            case question.eMail: 
                profile.email = userResponse;
                profile.phoneNumber = "No Phone Number Given"; 
                const contactTimeMessage = "When would be the best time to get in touch with you?"; 
                await ReferralBot.sendSuggestedBestContactTimeActions(turnContext, contactTimeMessage); 
                flow.lastQuestionAsked = question.bestContactTime; 
                break; 

            case question.voiceMessageConsent: 
                if (userResponse == "Yes") {
                    profile.voiceMessageConsent = "Consent Given"; 
                } else if (userResponse == "No") {
                    profile.voiceMessageConsent = "Consent Not Given"; 
                } else {
                    await turnContext.sendActivity("Sorry. Your answer was invalid. Please choose one of the given options."); 
                    const voiceMessageConsentMessage = "Is it okay if we leave a voice mail at the number you've given me?"; 
                    await ReferralBot.sendSuggestedVoiceMessageConsentActions(turnContext, voiceMessageConsentMessage);     
                }
                const textMessageConsentMessage = "Is it okay if we text you at the number you have entered?"; 
                await ReferralBot.sendSuggestedTextMessageConsentActions(turnContext, textMessageConsentMessage);
                flow.lastQuestionAsked = question.textMessageConsent; 
                break; 
            
            case question.textMessageConsent: 
                if (userResponse == "Yes") {
                    profile.textMessageConsent = "Consent Given"; 
                } else if (userResponse == "No") {
                    profile.textMessageConsent = "Consent Not Given"; 
                } else {
                    await turnContext.sendActivity("Sorry. Your answer was invalid. Please choose one of the given options."); 
                    const message = "Is it okay if we text you at the number you have entered?"; 
                    await ReferralBot.sendSuggestedVoiceMessageConsentActions(turnContext, message);     
                    break; 
                }
                const contactTimeMessage2 = "When would be the best time to contact you?"
                await ReferralBot.sendSuggestedBestContactTimeActions(turnContext, contactTimeMessage2); 
                flow.lastQuestionAsked = question.bestContactTime; 
                break; 

            case question.bestContactTime: 
                profile.bestContactTime = userResponse; 
                const guardianAwareMessage = "Are your parent(s) or guardian(s) aware that you are using this online referral form?"; 
                const trappedProblemMessage = "Have you had significant problems with feeling very trapped, lonely, sad, blue, depressed, or hopeless about the future?"; 
                if (profile.age < 14) {
                    await turnContext.sendActivity("Due to your age, we recommend that your parent(s) or guardian(s) be involved in your care. However, in some situations, we might be able to help even if they are not involved."); 
                    await ReferralBot.sendSuggestedGuardianFormAwarenessActions(turnContext, guardianAwareMessage); 
                    flow.lastQuestionAsked = question.guardianFormAwareness; 
                } else {
                    // Skip ahead to non youth part. 
                    await turnContext.sendActivity(trappedProblemMessage); 
                    flow.lastQuestionAsked = question.trappedFeelings;
                }
                break; 
            
            case question.trappedFeelings: 
                profile.trappedFeelings = userResponse; 
                const sleepTroubleMessage = "Have you had significant problems with sleep trouble, such as bad dreams, sleeping restlessly, or falling asleep during the day?"; 
                await turnContext.sendActivity(sleepTroubleMessage); 
                flow.lastQuestionAsked = question.sleepTrouble;
                break; 
            
            case question.sleepTrouble: 
                profile.sleepTrouble = userResponse; 
                const anxiousTroubleMessage = "Have you had significant problems with feeling very anxious, nervous, tense, scared, panicked, or like something bad was going to happen?";
                await turnContext.sendActivity(anxiousTroubleMessage);
                flow.lastQuestionAsked = question.anxiousTrouble  
                break; 

            case question.anxiousTrouble: 
                profile.anxiousTrouble = userResponse; 
                const distressedTroubleMessage = "Have you had significant problems with becoming very distressed and upset when something reminds you of the past?"; 
                await turnContext.sendActivity(distressedTroubleMessage); 
                flow.lastQuestionAsked = question.distressedTrouble; 
                break; 
            
            case question.distressedTrouble: 
                profile.distressedTrouble = userResponse; 
                const suicideTroubleMessage = "Have you had significant problems with thinking about ending your life or commiting suicide?";
                await turnContext.sendActivity(suicideTroubleMessage); 
                flow.lastQuestionAsked = question.adultSuicideTrouble; 
                break; 

            case question.adultSuicideTrouble: 
                profile.suicideProblem = userResponse; 
                const visualAudioTroubleMessage = "Have you had significant problems with seeing or hearing things that no one else could see or hear, or feeling that someone else could read or controll your thoughts?";
                await turnContext.sendActivity(visualAudioTroubleMessage); 
                flow.lastQuestionAsked = question.visualAudioTrouble;
                break; 
            
            case question.visualAudioTrouble: 
                profile.visualAudioTrouble = userResponse; 
                const attentionTroubleMessage = "Did you have a hard time paying attention at school, work, or home?"; 
                await turnContext.sendActivity(attentionTroubleMessage); 
                flow.lastQuestionAsked = question.attentionTrouble; 
                break; 
            
            case question.attentionTrouble: 
                profile.attentionTrouble = userResponse; 
                const alcoholDrugsTroubleMessage = "Have you used alcohol or drugs weekly or more often in the past?"; 
                await turnContext.sendActivity(alcoholDrugsTroubleMessage); 
                flow.lastQuestionAsked = question.alcoholDrugsTrouble; 
                break;
            
            case question.alcoholDrugsTrouble: 
                profile.alcoholDrugsTrouble = userResponse; 
                const alcoholDrugsEffectMessage = "Has your use of alcohol or drugs caused you to give up or reduce your involvement in activities at work, school, home, or social events?"; 
                await turnContext.sendActivity(alcoholDrugsEffectMessage); 
                flow.lastQuestionAsked = question.alcoholDrugsEffect; 
                break; 
            
            case question.alcoholDrugsEffect: 
                profile.alcoholDrugsEffect = userResponse; 
                const physicalConflictMessage = "Have you participated in a conflict in which you pushed, grabbed, or shoved someone?"; 
                await turnContext.sendActivity(physicalConflictMessage); 
                flow.lastQuestionAsked = question.physicalConflict; 
                break; 
            
            case question.physicalConflict: 
                profile.physicalConflict = userResponse; 
                const missingMealTroubleMessage = "Have you had significant problems with missing meals or throwing up much of what you did eat to control your weight"; 
                await turnContext.sendActivity(missingMealTroubleMessage); 
                flow.lastQuestionAsked = question.missingMealTrouble; 
                break; 
            
            case question.missingMealTrouble: 
                profile.missingMealTrouble = userResponse; 
                const bingeEatingTroubleMessage = "Have you had significant problems with eating binges or times when you ate very large amounts of food within a short period of time and then felt guilty?";
                await turnContext.sendActivity(bingeEatingTroubleMessage);
                flow.lastQuestionAsked = question.bingeEatingTrouble; 
                break; 

            case question.bingeEatingTrouble: 
                profile.bingeEatingTrouble = userResponse; 
                const disturbingDreamTroubleMessage = "Have you had significant problems with being disturbed by memories or dreams of distressing things from the past that you did, saw, or had happened to you?"; 
                await turnContext.sendActivity(disturbingDreamTroubleMessage); 
                flow.lastQuestionAsked = question.disturbingDreamTrouble; 
                break; 
            
            case question.disturbingDreamTrouble: 
                profile.disturbingDreamTrouble = userResponse; 
                const beingWatchedTroubleMessage = "Have you had significant problems with thinking or feeling that people are watching you, following you, or out to get you?";
                await turnContext.sendActivity(beingWatchedTroubleMessage); 
                flow.lastQuestionAsked = question.beingWatchedTrouble; 
                break; 
            
            case question.beingWatchedTrouble:  
                profile.beingWatchedTrouble = userResponse; 
                const internetTroubleMessage = "Have you had significant problems with video game playing or internet use that has caused you to give up, reduce, or have problems with important activities or people at work, school, home, or social events"; 
                await turnContext.sendActivity(internetTroubleMessage); 
                flow.lastQuestionAsked = question.internetTrouble; 
                break; 
            
            case question.internetTrouble: 
                profile.internetTrouble = userResponse; 
                const gamblingTroubleMessage = "Have you had significant problems with gambling that has caused you to give up, reduce, or have problems with important activities or people at work, school, home, or social events?"; 
                await turnContext.sendActivity(gamblingTroubleMessage); 
                flow.lastQuestionAsked = question.gamblingTrouble; 
                break; 

            case question.gamblingTrouble: 
                profile.gamblingTrouble = userResponse; 
                const pastHealthServicesReceivedMessage = "In the past 12 months, have you received any of the following types of services for problems with your emotions, mental health, or use of alcohol or drugs?"; 
                await ReferralBot.sendSuggestedPastHealthServicesReceivedActions(turnContext, pastHealthServicesReceivedMessage); 
                flow.lastQuestionAsked = question.pastHealthServicesReceived; 
                break; 

            case question.pastHealthServicesReceived: 
                profile.pastHealthServicesReceived = userResponse;
                const currentHospitalizationStatusMessage = "Are you currently in the hospital for a mental health concern?"; 
                await ReferralBot.sendSuggestedCurrentMentalHealthHospitalizationStatusActions(turnContext, currentHospitalizationStatusMessage); 
                flow.lastQuestionAsked = question.currentMentalHealthHospitalizationStatus; 
                break; 
            
            case question.currentMentalHealthHospitalizationStatus: 
                profile.currentMentalHealthHospitalizationStatus = userResponse; 
                const adultPhysicalDisabilityMessage = "Do you have any physical disability or any physical health concern?"; 
                await turnContext.sendActivity(adultPhysicalDisabilityMessage); 
                flow.lastQuestionAsked = question.adultPhysicalDisability; 
                break; 

            case question.adultPhysicalDisability: 
                profile.physicalDisability = userResponse; 
                const familyDoctorMessage = "Do you have a family doctor?"; 
                await turnContext.sendActivity(familyDoctorMessage); 
                flow.lastQuestionAsked = question.hasFamilyDoctor; 
                break; 

            case question.hasFamilyDoctor: 
                profile.hasFamilyDoctor = userResponse; 
                const adultIndigenousMessage = "Do you identify as indigenous?"; 
                await turnContext.sendActivity(adultIndigenousMessage); 
                flow.lastQuestionAsked = question.isIndigenous;
                break; 
                            
            case question.guardianFormAwareness:  
                profile.guardianFormAwareness = userResponse; 
                const guardianContactMessage = "Is it okay for the mental health team to contact your parent(s) or guardian(s)?"; 
                const guardianAwarenessMessage = "Are your parent(s) or guardian(s) aware that you are using this online referral form?"; 
                if (profile.guardianFormAwareness == "Yes") {
                    profile.guardianFormAwareness = "Yes";
                } else if (profile.guardianFormAwareness == "No") {
                    profile.guardianFormAwareness = "No"; 
                } else {
                    await turnContext.sendActivity("Sorry, you have entered an invalid input. Please select a valid option."); 
                    await ReferralBot.sendSuggestedGuardianFormAwarenessActions(turnContext, guardianAwarenessMessage); 
                    break; 
                }
                await ReferralBot.sendSuggestedGuardianContactConsentActions(turnContext, guardianContactMessage); 
                flow.lastQuestionAsked = question.guardianContactConsent; 
                break; 
            
            case question.guardianContactConsent: 
                profile.canContactGuardian = userResponse; 
                if (profile.canContactGuardian == "Yes") {
                    await turnContext.sendActivity("What is your parent or guardians name?"); 
                    flow.lastQuestionAsked = question.guardianName; 
                } else if (profile.canContactGuardian == "No") {
                    await turnContext.sendActivity("Please elaborate on the reason why we cannot contact your parent or guardian"); 
                    flow.lastQuestionAsked = question.guardianNoContactExplained; 
                } else {
                    await turnContext.sendActivity("Sorry. Your answer was invalid. Please choose one of the given options.");
                    await ReferralBot.sendSuggestedGuardianContactConsentActions(turnContext, guardianContactMessage);
                }
                break; 
            
            case question.guardianName: 
                profile.guardianName = userResponse; 
                const guardianRelationshipMessage = "How is your guardian related to you?"; 
                await ReferralBot.sendSuggestedGuardianRelationshipActions(turnContext, guardianRelationshipMessage); 
                flow.lastQuestionAsked = question.guardianRelationship; 
                break; 

            case question.guardianRelationship: 
                profile.guardianRelationship = userResponse;
                const guardianContactMethodMessage = "Which of the following is the best way to contact your parent or guardian?"; 
                await ReferralBot.sendSuggestedContactMethodActions(turnContext, guardianContactMethodMessage); 
                flow.lastQuestionAsked = question.guardianContactMethod;  
                break; 

            case question.guardianContactMethod:
                profile.guardianContactMethod = userResponse; 
                const contactMethodsMessage = "What is the best way to contact your guardian?" 
                if (profile.primaryContactMethod == "Phone Call") {
                    await turnContext.sendActivity("Please enter your guardians phone number"); 
                    flow.lastQuestionAsked = question.guardianPhoneNumber; 
                } else if (profile.primaryContactMethod == "Text") {
                    await turnContext.sendActivity("Please enter your guardians phone number"); 
                    flow.lastQuestionAsked = question.guardianPhoneNumber; 
                } else if (profile.primaryContactMethod == "E-mail") {
                    await turnContext.sendActivity("Pleas enter your guardians e-mail"); 
                    flow.lastQuestionAsked = question.guardianEmail;
                } else {
                    await turnContext.sendActivity("Sorry, please select one of the given options.");
                    await turnContext.sendActivity("What is the best way to contact your parent or guardian?"); 
                    await ReferralBot.sendSuggestedContactMethodActions(turnContext, contactMethodsMessage); 
                } 
                break; 
            
            case question.guardianPhoneNumber: 
                profile.guardianPhone = userResponse; 
                profile.guardianEmail = "No Email Given"; 
                const adultSupportMessage = "Do you have reliable adult/support in your life who is around when you need them?";
                await ReferralBot.sendSuggestedReliableAdultSupportActions(turnContext, adultSupportMessage); 
                flow.lastQuestionAsked = question.reliableAdultSupport; 
                break; 

            case question.guardianEmail: 
                profile.guardianEmail = userResponse; 
                profile.guardianPhone = "No Phone Number Given"; 
                const adultSupportMessage2 = "Do you have reliable adult/support in your life who is around when you need them?";
                await ReferralBot.sendSuggestedReliableAdultSupportActions(turnContext, adultSupportMessage2); 
                flow.lastQuestionAsked = question.reliableAdultSupport; 
                break; 
            
            case question.guardianNoContactExplained: 
                profile.guardianNoContactExplained = userResponse; 
                profile.guardianEmail = "No Email Given"; 
                profile.guardianPhone = "No Phone Number Given"; 
                const adultSupportMessage3 = "Do you have reliable adult/support in your life who is around when you need them?";
                await ReferralBot.sendSuggestedReliableAdultSupportActions(turnContext, adultSupportMessage3); 
                flow.lastQuestionAsked = question.reliableAdultSupport; 
                break; 

            case question.reliableAdultSupport: 
                profile.reliableAdultSupport = userResponse; 
                const highestEducationLevelMessage = "What is the highest education level you have achieved?"; 
                await ReferralBot.sendSuggestedHighestEducationLevelActions(turnContext, highestEducationLevelMessage); 
                flow.lastQuestionAsked = question.highestEducationLevel; 
                break; 
            
            case question.highestEducationLevel: 
                profile.highestEducationLevel = userResponse; 
                if (profile.age < 14) {
                    const indigenousMessage = "Do you identify as indigenous?"; 
                    await ReferralBot.sendSuggestedIsIndigenousActions(turnContext, indigenousMessage); 
                    flow.lastQuestionAsked = question.isIndigenous; 
                } else {
                    const situationMessage = "How would you best describe your current situation?"; 
                    await ReferralBot.sendSuggestedCurrentSituationActions(turnContext, situationMessage); 
                    flow.lastQuestionAsked = question.currentSituation; 
                }
                break; 

            case question.isIndigenous: 
                profile.isIndigenous = userResponse; 
                const originDescriptionMessage = "How would you best describe your origins?"; 
                await ReferralBot.sendSuggestedOriginActions(turnContext, originDescriptionMessage); 
                flow.lastQuestionAsked = question.originDescription; 
                break; 

            case question.originDescription: 
                profile.origin = userResponse; 
                if (profile.age < 14) {
                    const livingSituationMessage = "Where do you currently live?"; 
                    await ReferralBot.sendSuggestedLivingSituationActions(turnContext, livingSituationMessage); 
                    flow.lastQuestionAsked = question.livingSituation; 
                } else {
                    const citizenshipMessage = "What is your current citizenship status with respect to Canada?"; 
                    await turnContext.sendActivity(citizenshipMessage); 
                    flow.lastQuestionAsked = question.citizenship; 
                }
                break; 
            
            case question.citizenship: 
                profile.citizenship = userResponse;
                const sexualOrientationMessage = "How would you best describe your sexual orientation?"; 
                await turnContext.sendActivity(sexualOrientationMessage); 
                flow.lastQuestionAsked = question.sexualOrientation;  
                break;
            
            case question.sexualOrientation: 
                profile.sexualOrientation = userResponse; 
                const currentLivingSituationMessage = "Where do you currently live?"; 
                await ReferralBot.sendSuggestedLivingSituationActions(turnContext, currentLivingSituationMessage); 
                flow.lastQuestionAsked = question.livingSituation; 
                break; 
            
            case question.livingSituation: 
                profile.livingSituation = userResponse; 
                if (profile.age < 14) {
                    const currentSituationMessage = "How would you best describe your current situation?"; 
                    await ReferralBot.sendSuggestedCurrentSituationActions(turnContext, currentSituationMessage); 
                    flow.lastQuestionAsked = question.currentSituation; 
                } else {
                    const livingWithMessage = "Who do you currently live with?"; 
                    await turnContext.sendActivity(livingWithMessage); 
                    flow.lastQuestionAsked = question.livingWith; 
                }
                break; 
            
            case question.livingWith: 
                profile.livingWith = userResponse; 
                const getAlongLivingWithMessage = "How would you best describe how you get along with the people you live with?"; 
                await turnContext.sendActivity(getAlongLivingWithMessage); 
                flow.lastQuestionAsked = question.getAlongLivingWith; 
                break; 
            
            case question.getAlongLivingWith: 
                profile.getAlongLivingWith = userResponse; 
                const adultSupportMessage4 = "Do you have reliable adult/support in your life who is around when you need them?";
                await ReferralBot.sendSuggestedReliableAdultSupportActions(turnContext, adultSupportMessage4); 
                flow.lastQuestionAsked = question.reliableAdultSupport;
                break; 
            
            case question.currentSituation: 
                profile.currentSituation = userResponse;
                if (profile.age < 14) {
                    const additionalQuestionsMessage = "Do you have any additional information or questions you have for the youth mental health team you'd like me to convey?"; 
                    await turnContext.sendActivity(additionalQuestionsMessage); 
                    flow.lastQuestionAsked = question.additionalQuestions; 
                } else {
                    const householdIncomeMessage = "Last year, what was your total household income (excluding friends / roomates)?"; 
                    await turnContext.sendActivity(householdIncomeMessage); 
                    flow.lastQuestionAsked = question.householdIncome; 
                }
                break;
            
            case question.householdIncome: 
                profile.householdIncome = userResponse;
                const moreQuestionsMessage = "Do you have any additional information or questions you have for the youth mental health team you'd like me to convey?"; 
                await turnContext.sendActivity(moreQuestionsMessage); 
                flow.lastQuestionAsked = question.additionalQuestions; 
                break; 

            case question.additionalQuestions: 
                profile.additionalQuestions = userResponse; 
                await turnContext.sendActivity("You're almost done!");
                const userExperienceSurveyMessage =  "Your feedback can help us improve this form a lot! Would you like to complete a few more questions regarding your experience today for the opportunuty to be entered into a contest to win on of 10 $100 gift cards?"; 
                await ReferralBot.sendSuggestedFillSurveyActions(turnContext, userExperienceSurveyMessage);
                flow.lastQuestionAsked = question.fillFeedbackForm; 
                break;
            
            case question.fillFeedbackForm: 
                profile.fillFeedbackForm = userResponse; 
                if (profile.fillFeedbackForm == "Yes") {
                    // make them fill out the form 
                } else if (profile.fillFeedbackForm == "No") {
                    await turnContext.sendActivity("No Worries. In that case you are done. By entering any message the information you have sent today will be sent ")
                    flow.lastQuestionAsked = question.submitForm; 
                    break; 
                }
                break; 
            
            case question.submitForm: 
                //await storeData(this.myStorage, turnContext, profile.preferredName); 
                // await storeData(this.storage, turnContext, profile.urgency); 
                break; 

            case question.endScreen: 
                ReferralBot.sendEndMessage(turnContext); 
                break; 
        }
    }

    static async sendEndMessage(turnContext) {
        const exitMessage = "We're sorry to tell you that this new online referral service is only available in select communities at this time, and only availble for young people between the ages of 11-25.";
        await turnContext.sendActivity(exitMessage); 
    }

    static async sendSuggestedUrgencyActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Not Urgent',
                value: 'Not Urgent',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Somewhat Urgent',
                value: 'Somewhat Urgent',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Urgent',
                value: 'Urgent',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Very Urgent',
                value: 'Very Urgent',
            }
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedFoundFormActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Friends',
                value: 'Friends',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Family Member',
                value: 'Family Member',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Doctor',
                value: 'Doctor',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Guidance Counsellor / Teacher',
                value: 'Guidance Counsellor / Teacher',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Online',
                value: 'Online',
            }
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedLocationActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Downtown Montreal - For Youth in Homeless Situations (RIPAJ)',
                value: 'Downtown Montreal - For Youth in Homeless Situations (RIPAJ)',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Chatham-Kent Ontario',
                value: 'Chatham-Kent Ontario',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Douglas',
                value: 'Douglas',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Other',
                value: 'Other',
            },
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedGenderActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Male',
                value: 'male',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Female',
                value: 'female',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Non-binary',
                value: 'non-binary',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Two-spirited',
                value: 'two-spirited',
            },
            {
                type: ActionTypes.PostBack,
                title: 'I prefer not to answer',
                value: 'i prefer not to answer'
            }
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedConcernsBeganActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'In the past month',
                value: 'In the past month',
            },
            {
                type: ActionTypes.PostBack,
                title: '2 to 3 months ago',
                value: '2 to 3 months ago',
            },
            {
                type: ActionTypes.PostBack,
                title: '4 to 12 months ago',
                value: '4 to 12 months ago',
            },
            {
                type: ActionTypes.PostBack,
                title: 'More than a year ago',
                value: 'More than a year ago',
            }
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedPreferredMentalHealthServicesActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Information',
                value: 'Information',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Peer Support',
                value: 'Peer Support',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Medication',
                value: 'Medication',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Counselling or Therapy',
                value: 'Counselling or Therapy',
            }
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedPastHealthServicesReceivedActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Information',
                value: 'Information',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Peer Support',
                value: 'Peer Support',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Medication',
                value: 'Medication',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Counselling or Therapy',
                value: 'Counselling or Therapy',
            },
            {
                type: ActionTypes.PostBack,
                title: 'I did not receive services',
                value: 'I did not receive services',
            },
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }


    static async sendSuggestedContactMethodActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Phone Call',
                value: 'Phone Call',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Text',
                value: 'Text',
            },
            {
                type: ActionTypes.PostBack,
                title: 'E-mail',
                value: 'E-mail',
            },
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedBestContactTimeActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Morning',
                value: 'Morning',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Around Noon',
                value: 'Around Noon',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Afternoon',
                value: 'Afternoon',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Evening',
                value: 'Evening',
            }
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedVoiceMessageConsentActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Yes',
                value: 'Yes',
            },
            {
                type: ActionTypes.PostBack,
                title: 'No',
                value: 'No',
            },
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedCurrentMentalHealthHospitalizationStatusActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Yes',
                value: 'Yes',
            },
            {
                type: ActionTypes.PostBack,
                title: 'No',
                value: 'No',
            },
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedTextMessageConsentActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Yes',
                value: 'Yes',
            },
            {
                type: ActionTypes.PostBack,
                title: 'No',
                value: 'No',
            },
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedGuardianFormAwarenessActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Yes',
                value: 'Yes',
            },
            {
                type: ActionTypes.PostBack,
                title: 'No',
                value: 'No',
            },
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedGuardianContactConsentActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Yes',
                value: 'Yes',
            },
            {
                type: ActionTypes.PostBack,
                title: 'No',
                value: 'No',
            },
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedGuardianRelationshipActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Father',
                value: 'Father',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Mother',
                value: 'Mother',
            },
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedReliableAdultSupportActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Yes',
                value: 'Yes',
            },
            {
                type: ActionTypes.PostBack,
                title: 'No',
                value: 'No',
            },
            {
                type: ActionTypes.PostBack.PostBack,
                title: 'Not Sure',
                value: 'Not Sure',
            }
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedHighestEducationLevelActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Primary School / Elementary School',
                value: 'Primary School / Elementary School',
            },
            {
                type: ActionTypes.PostBack,
                title: 'High School',
                value: 'High School',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Not Sure',
                value: 'Not Sure',
            },
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedIsIndigenousActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Yes',
                value: 'Yes',
            },
            {
                type: ActionTypes.PostBack,
                title: 'No',
                value: 'No',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Not Sure',
                value: 'Not Sure',
            },
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedOriginActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Arab',
                value: 'Arab',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Black',
                value: 'Black',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Chinese',
                value: 'Chinese',
            },
            {
                type: ActionTypes.PostBack,
                title: 'White',
                value: 'White',
            },
            {
                type: ActionTypes.PostBack,
                title: 'South Asian',
                value: 'South Asian',
            },
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedLivingSituationActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'House',
                value: 'House',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Apartment',
                value: 'Apartment',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Group Home',
                value: 'Group Home',
            },
            {
                type: ActionTypes.PostBack,
                title: 'On the Street',
                value: 'On the Street',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Couch Surf',
                value: 'Couch Surf',
            },
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedCurrentSituationActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Taking care of my basic needs',
                value: 'Taking care of my basic needs',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Working (full time or part time)',
                value: 'Working (full time or part time)',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Going to school',
                value: 'Going to school',
            },
            {
                type: ActionTypes.PostBack,
                title: 'Volunteering',
                value: 'Volunteering',
            },
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static async sendSuggestedFillSurveyActions(turnContext, message) {
        const cardActions = [
            {
                type: ActionTypes.PostBack,
                title: 'Yes',
                value: 'Yes',
            },
            {
                type: ActionTypes.PostBack,
                title: 'No',
                value: 'No',
            },
        ];

        var reply = MessageFactory.suggestedActions(cardActions, message);
        await turnContext.sendActivity(reply);
    }

    static validateAge(input) {
        // Try to recognize the input as a number. This works for responses such as "twelve" as well as "12".
        try {
            // Attempt to convert the Recognizer result to an integer. This works for "a dozen", "twelve", "12", and so on.
            // The recognizer returns a list of potential recognition results, if any.
            const results = Recognizers.recognizeNumber(input, Recognizers.Culture.English);
            let output;
            results.forEach(result => {
                // result.resolution is a dictionary, where the "value" entry contains the processed string.
                const value = result.resolution.value;
                if (value) {
                    const age = parseInt(value);
                    if (!isNaN(age) && age >= 1 && age <= 120) {
                        output = { success: true, age: age };
                        return;
                    }
                }
            });
            return output || { success: false, message: 'Please enter an age between 1 and 120.' };
        } catch (error) {
            return {
                success: false,
                message: "I'm sorry, I could not interpret that as an age. Please enter an age between 1 and 120."
            };
        }
    }
}

module.exports.ReferralBot = ReferralBot;
