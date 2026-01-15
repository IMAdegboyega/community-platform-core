import { useState } from "react";
import { EditPlanModal } from "./FloatyModals";

const Subscriptions = () => {
    const [showPlans, setShowPlans] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleEditPlan = (plan) => {
        setSelectedPlan(plan);
        setShowEditModal(true);
    };

    const handleSavePlan = (updatedPlan) => {
        console.log('Saving plan:', updatedPlan);
        // Add your save logic here
      };

  if (!showPlans) {
    // Initial Upgrade Account View
    return (
      <div className="p-8">
        <h2 className="text-gray-800 font-medium mb-4">Set the price for your subscriptions</h2>
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          Offer a subscription and your subscribers can view your photos and videos for a set price. You can also offer several 
          months as a package or a discounted subscription to attract new subscribers or to win back old subscribers. Buyers pay 
          you on a monthly basis and get access to all published content. Important: Subscribers expect you to post high quality 
          photos and videos on a regular basis.
        </p>

        <div className="bg-red-50 rounded-lg p-6">
          <h3 className="text-red-600 font-semibold mb-3">Upgrade your account</h3>
          <p className="text-gray-700 text-sm mb-4 leading-relaxed">
            Please be aware that you can only enable subscriptions if you have a verified profile and bank connection. 
            We will check your information and send you a confirmation email as soon as this process has been 
            completed.
          </p>
          <button
            onClick={() => setShowPlans(true)}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Upgrade
          </button>
        </div>
      </div>
    );
  }

  // Subscription Plans View
  const plans = [
    { duration: '1 Month', tokens: 100 },
    { duration: '3 Months', tokens: 100 },
    { duration: '6 Months', tokens: 100 },
    { duration: '12 Months', tokens: 100 }
  ];

  return (
    <div className="p-8">
      <button
        onClick={() => setShowPlans(false)}
        className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
      >
        <span>←</span>
        <span>Back</span>
      </button>

      <h2 className="text-gray-800 font-medium mb-4">Set the price for your subscriptions</h2>
      <p className="text-gray-600 text-sm mb-8 leading-relaxed">
        Offer a subscription and your subscribers can view your photos and videos for a set price. You can also offer several 
        months as a package or a discounted subscription to attract new subscribers or to win back old subscribers. Buyers pay 
        you on a monthly basis and get access to all published content. Important: Subscribers expect you to post high quality 
        photos and videos on a regular basis.
      </p>

      <div className="mb-6">
        <h3 className="text-gray-800 font-semibold mb-2">Plans</h3>
        <p className="text-gray-600 text-sm">Choose what to offer your subscribers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
            <h4 className="text-3xl font-bold text-blue-600 mb-2">{plan.tokens} Token</h4>
            <p className="text-gray-600 mb-4">{plan.duration}</p>
            
            <div className="space-y-2 mb-6 text-left">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm text-gray-600">View all post</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm text-gray-600">View all photos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm text-gray-600">View all videos</span>
              </div>
            </div>

            <button onClick={() => handleEditPlan(plan)} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Edit Plan
            </button>
          </div>
        ))}
      </div>
        <EditPlanModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSave={handleSavePlan}
            planDuration={selectedPlan?.duration}
        /> 
    </div>
  );
};

export default Subscriptions;