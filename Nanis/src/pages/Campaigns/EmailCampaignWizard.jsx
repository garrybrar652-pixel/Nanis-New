import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Save, X } from 'lucide-react';
import {PrimaryButton, SecondaryButton, TertiaryButton} from '../../components/common/Button';
import Input from '../../components/common/input';

// Step components (will be created separately)

const EmailCampaignWizard = () => {
    const [campaignName, setCampaignName] = useState('');
    return (
        <div className="flex flex-col items-start w-full min-h-screen">

            <div className="bg-[#ededed] flex items-end justify-between p-[20px] w-full">
                <div className="flex flex-col gap-[8px] w-[352px]">
                    <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[1.2]">
                        Campaigns
                    </p>
                    <h1 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[24px] tracking-[-0.48px] leading-[1.2]">
                        Create a new campaign
                    </h1>
                </div>

                <button
                    className="bg-white border border-[#e1e4ea] flex gap-[4px] items-center justify-center px-[12px] py-[8px] rounded-[10px] hover:bg-gray-50 transition-colors"
                >
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="7.5" stroke="#64748b" strokeWidth="1.5" />
                        <path d="M9 6v3m0 3h.01" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
                        Learn more
                    </span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="bg-[#ededed] flex flex-col grow w-full min-h-screen overflow-auto pb-[20px] px-[20px]">
                <div className="flex flex-col items-center gap-[24px] px-[444px] py-[40px] rounded-[20px] bg-white shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)] flex-[1_0_0] self-stretch">
                    {/* Header Section */}
                    <div className="flex flex-col justify-center items-start gap-[12px] self-stretch">
                        <div className="flex items-center gap-[8px] self-stretch">
                            <div className="flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M16.6665 10H3.33317M3.33317 10L8.33317 5M3.33317 10L8.33317 15" stroke="#335CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[20px] tracking-[-0.2px] leading-[1.2]">
                                Create an email campaign
                            </h2>
                        </div>
                        <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px] w-full">
                            Keep subscribers engaged by sharing your latest news, promoting your bestselling products, or announcing an upcoming event.
                        </p>
                    </div>

                    <div className="w-[536px]">
                        <Input
                            label="Campaign name"
                            placeholder="Your campaign name"
                            value={campaignName}
                            onChange={setCampaignName}
                            maxLength={128}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-[20px] w-full">
                        <SecondaryButton>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton>
                            Continue
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailCampaignWizard;