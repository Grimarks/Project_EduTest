package service

import (
	"errors"
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/model"
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/repository"
	"github.com/google/uuid"
)

type PremiumClassService interface {
	CreateClass(request *CreateClassRequest) (*model.PremiumClass, error)
	GetAllClasses() ([]model.PremiumClass, error)
	GetClassByID(id string) (*model.PremiumClass, error)
	UpdateClass(id string, request *UpdateClassRequest) (*model.PremiumClass, error)
	DeleteClass(id string) error
}

type premiumClassService struct {
	repo repository.PremiumClassRepository
}

type CreateClassRequest struct {
	Title       string  `json:"title" validate:"required"`
	Description string  `json:"description"`
	Instructor  string  `json:"instructor" validate:"required"`
	Price       float64 `json:"price" validate:"required,gt=0"`
	ImageURL    string  `json:"image_url" validate:"url"`
	Category    string  `json:"category"`
}

type UpdateClassRequest struct {
	Title       string  `json:"title" validate:"required"`
	Description string  `json:"description"`
	Instructor  string  `json:"instructor" validate:"required"`
	Price       float64 `json:"price" validate:"required,gt=0"`
	ImageURL    string  `json:"image_url" validate:"url"`
	Category    string  `json:"category"`
}


func NewPremiumClassService(repo repository.PremiumClassRepository) PremiumClassService {
	return &premiumClassService{repo}
}

func (s *premiumClassService) CreateClass(request *CreateClassRequest) (*model.PremiumClass, error) {
	class := &model.PremiumClass{
		ID:          uuid.New(),
		Title:       request.Title,
		Description: request.Description,
		Instructor:  request.Instructor,
		Price:       request.Price,
		ImageURL:    request.ImageURL,
		Category:    request.Category,
	}

	err := s.repo.Create(class)
	if err != nil {
		return nil, err
	}
	return class, nil
}

func (s *premiumClassService) GetAllClasses() ([]model.PremiumClass, error) {
	return s.repo.FindAll()
}

func (s *premiumClassService) GetClassByID(id string) (*model.PremiumClass, error) {
	classUUID, err := uuid.Parse(id)
	if err != nil {
		return nil, errors.New("invalid id format")
	}
	return s.repo.FindByID(classUUID)
}

func (s *premiumClassService) UpdateClass(id string, request *UpdateClassRequest) (*model.PremiumClass, error) {
	classUUID, err := uuid.Parse(id)
	if err != nil {
		return nil, errors.New("invalid id format")
	}

	existingClass, err := s.repo.FindByID(classUUID)
	if err != nil {
		return nil, errors.New("class not found")
	}

	existingClass.Title = request.Title
	existingClass.Description = request.Description
	existingClass.Instructor = request.Instructor
	existingClass.Price = request.Price
	existingClass.ImageURL = request.ImageURL
	existingClass.Category = request.Category

	err = s.repo.Update(existingClass)
	if err != nil {
		return nil, err
	}
	return existingClass, nil
}

func (s *premiumClassService) DeleteClass(id string) error {
	classUUID, err := uuid.Parse(id)
	if err != nil {
		return errors.New("invalid id format")
	}
	return s.repo.Delete(classUUID)
}