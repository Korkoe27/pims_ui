import { createCaseHistoryHandler, updateCaseHistoryHandler, fetchCaseHistoryHandler } from './examinations-handler';
import apiClient from '../apiService';

jest.mock('../apiService'); // Mock the apiClient to avoid real API calls

describe('CaseHistory Handlers', () => {
  const appointmentId = 'your-appointment-id';
  const mockData = {
    chiefComplaint: 'Patient has blurry vision.',
    appointment: appointmentId,
  };

  it('should fetch CaseHistory by appointmentId', async () => {
    apiClient.get.mockResolvedValue({ data: { id: '123', ...mockData } });

    const response = await fetchCaseHistoryHandler(appointmentId);
    expect(apiClient.get).toHaveBeenCalledWith(`/tests/api/case-history/appointment/${appointmentId}/`);
    expect(response.data).toHaveProperty('id', '123');
  });

  it('should create a new CaseHistory', async () => {
    apiClient.post.mockResolvedValue({ data: { id: '124', ...mockData } });

    const response = await createCaseHistoryHandler(mockData);
    expect(apiClient.post).toHaveBeenCalledWith('/tests/api/case-history/', mockData);
    expect(response.data).toHaveProperty('id', '124');
  });

  it('should update an existing CaseHistory', async () => {
    const updateData = { ...mockData, chiefComplaint: 'Updated chief complaint.' };
    apiClient.put.mockResolvedValue({ data: { id: '123', ...updateData } });

    const response = await updateCaseHistoryHandler(appointmentId, updateData);
    expect(apiClient.put).toHaveBeenCalledWith(`/tests/api/case-history/${appointmentId}/`, updateData);
    expect(response.data).toHaveProperty('chiefComplaint', 'Updated chief complaint.');
  });
});
