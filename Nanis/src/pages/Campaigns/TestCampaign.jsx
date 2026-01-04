import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCampaign, useCampaigns } from '../../hooks/useCampaigns';
import campaignService from '../../services/api/campaign.service';
import toast from 'react-hot-toast';
import { Mail, Send, Loader2 } from 'lucide-react';

const TestCampaign = () => {
  const navigate = useNavigate();
  const createCampaignMutation = useCreateCampaign();
  const { refetch } = useCampaigns();
  const [sending, setSending] = useState(false);
  const [campaignName, setCampaignName] = useState('Test Campaign ' + new Date().toLocaleTimeString());
  const [subject, setSubject] = useState('Test Email from Nanis Campaign');
  const [message, setMessage] = useState('Hello! This is a test email from your Nanis campaign system. If you receive this, everything is working perfectly! 🎉');

  const handleCreateAndSend = async () => {
    try {
      setSending(true);

      // Step 1: Create campaign
      toast.loading('Creating campaign...', { id: 'create-campaign' });
      
      const campaignData = {
        name: campaignName,
        emoji: '📧',
        category: 'email',
        subject: subject,
        preview: 'Test campaign preview text',
        content: `<html><body style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #335cff;">${subject}</h1>
          <p style="font-size: 16px; line-height: 1.6;">${message}</p>
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            Sent at: ${new Date().toLocaleString()}<br/>
            Powered by Nanis Campaign System
          </p>
        </body></html>`,
        status: 'draft',
        group_ids: [7] // Using the test group ID from seeder (update if different)
      };

      const createResponse = await createCampaignMutation.mutateAsync(campaignData);
      
      if (!createResponse.success) {
        throw new Error(createResponse.message || 'Failed to create campaign');
      }

      const campaignId = createResponse.data.id;
      toast.success('Campaign created!', { id: 'create-campaign' });

      // Step 2: Send campaign
      toast.loading('Sending campaign...', { id: 'send-campaign' });
      
      const sendResponse = await campaignService.sendCampaign(campaignId);
      
      if (!sendResponse.success) {
        throw new Error(sendResponse.message || 'Failed to send campaign');
      }

      toast.success('Campaign is being sent! Check your email.', { id: 'send-campaign' });
      
      // Wait a moment then refetch campaigns and navigate
      setTimeout(() => {
        refetch();
        navigate('/campaigns');
      }, 2000);

    } catch (error) {
      console.error('Error sending campaign:', error);
      toast.error(error.message || 'Failed to send campaign', { id: 'send-campaign' });
      toast.dismiss('create-campaign');
    } finally {
      setSending(false);
    }
  };

  return (
    <div 
      style={{ 
        height: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0px 1px 2px 1px rgba(84,87,96,0.14), 0px 1px 2px 0px rgba(84,87,96,0.16), 0px 0px 0px 1.5px rgba(84,87,96,0.02)',
        width: '100%',
        padding: '32px',
        marginTop: '0',
        overflow: 'auto'
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            backgroundColor: '#e0e7ff', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Mail size={32} color="#335cff" />
          </div>
          <h1 style={{ 
            color: '#0e121b', 
            fontSize: '28px', 
            fontWeight: '700', 
            marginBottom: '8px' 
          }}>
            Test Email Campaign
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Send a test campaign to verify your email configuration
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Campaign Name */}
          <div>
            <label style={{ 
              display: 'block', 
              color: '#0e121b', 
              fontSize: '14px', 
              fontWeight: '600', 
              marginBottom: '8px' 
            }}>
              Campaign Name
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1.5px solid #e1e4ea',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#335cff'}
              onBlur={(e) => e.target.style.borderColor = '#e1e4ea'}
            />
          </div>

          {/* Subject */}
          <div>
            <label style={{ 
              display: 'block', 
              color: '#0e121b', 
              fontSize: '14px', 
              fontWeight: '600', 
              marginBottom: '8px' 
            }}>
              Email Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1.5px solid #e1e4ea',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#335cff'}
              onBlur={(e) => e.target.style.borderColor = '#e1e4ea'}
            />
          </div>

          {/* Message */}
          <div>
            <label style={{ 
              display: 'block', 
              color: '#0e121b', 
              fontSize: '14px', 
              fontWeight: '600', 
              marginBottom: '8px' 
            }}>
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              style={{
                width: '100%',
                padding: '12px',
                border: '1.5px solid #e1e4ea',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#335cff'}
              onBlur={(e) => e.target.style.borderColor = '#e1e4ea'}
            />
          </div>

          {/* Info Box */}
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '8px'
          }}>
            <p style={{ 
              color: '#0c4a6e', 
              fontSize: '14px', 
              margin: 0,
              lineHeight: '1.6'
            }}>
              📧 <strong>Recipient:</strong> Test Group (dhillonlovepreet147@gmail.com)<br/>
              ⚙️ <strong>SMTP:</strong> Gmail (configured)<br/>
              🔄 <strong>Queue:</strong> Background worker running
            </p>
          </div>

          {/* Send Button */}
          <button
            onClick={handleCreateAndSend}
            disabled={sending || !campaignName || !subject || !message}
            style={{
              backgroundColor: sending ? '#94a3b8' : '#335cff',
              color: 'white',
              padding: '14px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: sending ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!sending) e.target.style.backgroundColor = '#2947cc';
            }}
            onMouseLeave={(e) => {
              if (!sending) e.target.style.backgroundColor = '#335cff';
            }}
          >
            {sending ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={20} />
                Create & Send Test Campaign
              </>
            )}
          </button>

          {/* Back Button */}
          <button
            onClick={() => navigate('/campaigns')}
            disabled={sending}
            style={{
              backgroundColor: 'transparent',
              color: '#64748b',
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1.5px solid #e1e4ea',
              fontSize: '14px',
              fontWeight: '500',
              cursor: sending ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!sending) {
                e.target.style.borderColor = '#335cff';
                e.target.style.color = '#335cff';
              }
            }}
            onMouseLeave={(e) => {
              if (!sending) {
                e.target.style.borderColor = '#e1e4ea';
                e.target.style.color = '#64748b';
              }
            }}
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestCampaign;
