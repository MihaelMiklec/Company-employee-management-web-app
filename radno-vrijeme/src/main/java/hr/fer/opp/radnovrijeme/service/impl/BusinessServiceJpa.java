package hr.fer.opp.radnovrijeme.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import hr.fer.opp.radnovrijeme.dao.BusinessRepository;
import hr.fer.opp.radnovrijeme.domain.Business;
import hr.fer.opp.radnovrijeme.dto.BusinessDTO;
import hr.fer.opp.radnovrijeme.exceptions.EntityMissingException;
import hr.fer.opp.radnovrijeme.exceptions.RequestDeniedException;
import hr.fer.opp.radnovrijeme.service.BusinessService;
import hr.fer.opp.radnovrijeme.service.GroupService;
import hr.fer.opp.radnovrijeme.service.TaskService;

@Service
public class BusinessServiceJpa implements BusinessService {

	@Autowired
	private BusinessRepository businessRepo;

	@Autowired
	private GroupService groupService;

	@Autowired
	private TaskService taskService;

	@Override
	public Business fetch(long businessId) {
		return businessRepo.findById(businessId)
				.orElseThrow(() -> new EntityMissingException(Business.class, businessId));
	}

	@Override
	public List<BusinessDTO> listAll() {
		return businessRepo.findAll().stream().map(e -> new BusinessDTO(e)).collect(Collectors.toList());
	}

	@Override
	public BusinessDTO findById(long businessId) {
		Optional<Business> business = businessRepo.findById(businessId);

		if (!business.isPresent())
			throw new EntityMissingException(Business.class, businessId);

		return new BusinessDTO(business.get());
	}

	@Override
	public BusinessDTO createBusiness(BusinessDTO dto) {
		validate(dto);
		Assert.isNull(dto.getId(), "Business ID must be null, not: " + dto.getId());
		if (businessRepo.countByName(dto.getName()) > 0)
			throw new RequestDeniedException("Business with name " + dto.getName() + " already exists");

		return new BusinessDTO(businessRepo.save(businessFromDTO(dto)));

	}

	@Override
	public BusinessDTO updateBusiness(BusinessDTO dto) {
		validate(dto);
		if (!businessRepo.existsById(dto.getId()))
			throw new EntityMissingException(Service.class, dto.getId());
		if (businessRepo.existsByNameAndIdNot(dto.getName(), dto.getId()))
			throw new RequestDeniedException("Business with name " + dto.getName() + " already exists");

		return new BusinessDTO(businessRepo.save(businessFromDTO(dto)));
	}

	@Override
	public BusinessDTO deleteBusiness(long businessId) {
		Business business = fetch(businessId);

		taskService.listAll().stream().filter(e -> Objects.nonNull(e.getBusinessId()) && e.getBusinessId().equals(businessId))
				.forEach(e -> {
					e.setBusinessId(null);
					taskService.updateTask(e);
				});

		businessRepo.delete(business);
		return new BusinessDTO(business);
	}

	public Business businessFromDTO(BusinessDTO dto) {
		Business business = new Business();

		business.setId(dto.getId());
		business.setName(dto.getName());
		business.setDescription(dto.getDescription());
		business.setPricePerHour(dto.getPricePerHour());

		if (dto.getGroupId() != null) {
			business.setGroup(groupService.fetch(dto.getGroupId()));
		}

		return business;
	}

	private void validate(BusinessDTO dto) {
		Assert.notNull(dto, "Business object must be given");
		Assert.hasText(dto.getName(), "Business name must be given");
		Assert.notNull(dto.getPricePerHour(), "Business price per hour must be givens");
	}
}
