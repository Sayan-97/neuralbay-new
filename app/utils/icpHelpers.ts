{/*// icpHelpers.ts
export const transferICP = async (principal: string, modelId: string, amount: number) => {
    if (window.ic?.plug) {
      const transferResult = await window.ic.plug.requestTransfer({
        to: "your-receiver-principal", // Replace with the recipient's principal or canister
        amount: amount * 1e8, // Convert ICP to e8s
      });
  
      if (transferResult) {
        console.log("Transfer successful", transferResult);
      } else {
        throw new Error("Transfer failed");
      }
    } else {
      throw new Error("Plug Wallet not installed");
    }
  };
  */}

  // mock transaction

export const transferICP = async (principal: string, modelId: string, amount: number) => {
    // Simulate a successful payment for testing purposes
    return new Promise((resolve) => {
      console.log(`Simulating payment of ${amount} ICP from ${principal} to model: ${modelId}`);
      
      // Mock delay to simulate network/payment processing
      setTimeout(() => {
        console.log("Payment simulated successfully");
        resolve({ success: true });
      }, 1000);
    });
  };
  