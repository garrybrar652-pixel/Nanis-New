import { useParams } from 'react-router-dom';
import EmailEditorMain from '../../components/email-editor';

export default function EmailEditorPage() {
  const { templateId } = useParams();

  // Load template if editing existing
  // useEffect(() => {
  //   if (templateId) {
  //     emailTemplateService.getTemplate(templateId).then(setTemplate);
  //   }
  // }, [templateId]);

  return <EmailEditorMain />;
}