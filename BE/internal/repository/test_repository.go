package repository

import (
    "github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/model"
    "github.com/google/uuid"
    "gorm.io/gorm"
)

type TestRepository interface {
    Create(test *model.Test) error
    FindAll() ([]model.Test, error)
    FindByID(id uuid.UUID) (*model.Test, error)
    Update(test *model.Test) error
    Delete(id uuid.UUID) error
}

type testRepository struct {
    db *gorm.DB
}

func NewTestRepository(db *gorm.DB) TestRepository {
    return &testRepository{db}
}

func (r *testRepository) Create(test *model.Test) error {
    return r.db.Create(test).Error
}

func (r *testRepository) FindAll() ([]model.Test, error) {
    var tests []model.Test
    err := r.db.Preload("Questions").Find(&tests).Error
    return tests, err
}

func (r *testRepository) FindByID(id uuid.UUID) (*model.Test, error) {
    var test model.Test
    err := r.db.Preload("Questions").First(&test, "id = ?", id).Error
    return &test, err
}

func (r *testRepository) Update(test *model.Test) error {
    return r.db.Save(test).Error
}

func (r *testRepository) Delete(id uuid.UUID) error {
    return r.db.Delete(&model.Test{}, "id = ?", id).Error
}