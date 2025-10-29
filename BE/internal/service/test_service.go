package service

import (
    "github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/model"
    "github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/repository"
    "github.com/google/uuid"
)

type TestService interface {
    CreateTest(test *model.Test) error
    GetAllTests() ([]model.Test, error)
    GetTestByID(id string) (*model.Test, error)
    UpdateTest(id string, testData *model.Test) (*model.Test, error)
    DeleteTest(id string) error
}

type testService struct {
    repo repository.TestRepository
}

func NewTestService(repo repository.TestRepository) TestService {
    return &testService{repo}
}

func (s *testService) CreateTest(test *model.Test) error {
    test.ID = uuid.New()
    return s.repo.Create(test)
}

func (s *testService) GetAllTests() ([]model.Test, error) {
    return s.repo.FindAll()
}

func (s *testService) GetTestByID(id string) (*model.Test, error) {
    uuid, err := uuid.Parse(id)
    if err != nil {
        return nil, err
    }
    return s.repo.FindByID(uuid)
}

func (s *testService) UpdateTest(id string, testData *model.Test) (*model.Test, error) {
    uuid, err := uuid.Parse(id)
    if err != nil {
        return nil, err
    }

    existingTest, err := s.repo.FindByID(uuid)
    if err != nil {
        return nil, err
    }

    existingTest.Title = testData.Title
    existingTest.Description = testData.Description
	//to be updated

    err = s.repo.Update(existingTest)
    return existingTest, err
}

func (s *testService) DeleteTest(id string) error {
    uuid, err := uuid.Parse(id)
    if err != nil {
        return err
    }
    return s.repo.Delete(uuid)
}