// import { getSigner } from "./ethers.service";
import ChargedParticles from "./abis/v2/ChargedParticles.json";
import { ethers } from 'ethers';

export const getStateAddress = async () => {
   const provider = ethers.providers.getDefaultProvider();
   const contract = new ethers.Contract(
      '0xaB1a1410EA40930755C1330Cc0fB3367897C8c41',
      ChargedParticles,
      provider
   );
   const stateAddress = await contract.getStateAddress();
   // console.log(stateAddress);
   return stateAddress;
}