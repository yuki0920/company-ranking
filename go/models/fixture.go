package models

import (
	"time"

	"github.com/google/uuid"
)

func SecurityFixture(setter func(security *Security)) *Security {
	security := &Security{
		Code:         uuid.New().String(),
		Name:         uuid.New().String(),
		MarketID:     int64(uuid.New().ID() % 100000),
		IndustryCode: int(uuid.New().ID() % 100000),
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	setter(security)

	return security
}

func DocumentFixture(setter func(document *Document)) *Document {
	document := &Document{
		SecurityCode: uuid.New().String(),
		DocumentID:   uuid.New().String(),
		EdinetCode:   uuid.New().String(),
		FilerName:    uuid.New().String(),
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	setter(document)

	return document
}
