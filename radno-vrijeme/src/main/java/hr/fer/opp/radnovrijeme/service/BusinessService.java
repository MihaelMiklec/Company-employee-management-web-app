package hr.fer.opp.radnovrijeme.service;

import java.util.List;

import hr.fer.opp.radnovrijeme.domain.Business;
import hr.fer.opp.radnovrijeme.dto.BusinessDTO;

public interface BusinessService {
	
	Business fetch(long businessId);

	List<BusinessDTO> listAll();

	BusinessDTO findById(long businessId);

	BusinessDTO createBusiness(BusinessDTO dto);

	BusinessDTO updateBusiness(BusinessDTO dto);

	BusinessDTO deleteBusiness(long businessId);

	//List<GroupDTO> listGroups(long businessId);
}
