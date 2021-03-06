using Mapster;
using Pims.Api.Areas.Project.Models.Search;
using Pims.Api.Models;
using Pims.Dal.Entities;
using Pims.Dal.Helpers.Extensions;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Api.Areas.Project.Mapping.Search
{
    public class ProjectPropertyMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<ProjectProperty, ProjectPropertyModel>()
                .Map(dest => dest.PropertyTypeId,
                    src => src.Building != null ? PropertyTypes.Building : PropertyTypes.Land)
                .Map(dest => dest.Id, src => src.BuildingId ?? src.ParcelId)
                .Map(dest => dest.Classification,
                    src => src.Building != null ? src.Building.Classification.Name : src.Parcel.Classification.Name)
                .Map(dest => dest.Name, src => src.Building != null ? src.Building.Name : src.Parcel.Name)
                .Map(dest => dest.Address,
                    src => src.Building != null
                        ? src.Building.Address.FormatAddress()
                        : src.Parcel.Address.FormatAddress())
                .Map(dest => dest.AdministrativeArea,
                    src => src.Building != null ? src.Building.Address.AdministrativeArea : src.Parcel.Address.AdministrativeArea)
                .Map(dest => dest.Assessed,
                    src => src.Building != null
                        ? GetBuildingAssessedValue(src.Building.Evaluations)
                        : GetParcelAssessedValue(src.Parcel.Evaluations))
                .Map(dest => dest.NetBook,
                    src => src.Building != null
                        ? GetBuildingNetBookValue(src.Building.Fiscals)
                        : GetParcelNetBookValue(src.Parcel.Fiscals))
                .Map(dest => dest.Market,
                    src => src.Building != null
                        ? GetBuildingMarketValue(src.Building.Fiscals)
                        : GetParcelMarketValue(src.Parcel.Fiscals))
                .Map(dest => dest.Zoning, src => src.Building != null ? src.Building.GetZoning().First() : src.Parcel.Zoning)
                .Map(dest => dest.ZoningPotential, src => src.Building != null ? src.Building.GetZoningPotential().First() : src.Parcel.ZoningPotential)

                .Map(dest => dest.AgencyCode,
                    src => src.Building != null ? GetAgencyCode(src.Building.Agency) : GetAgencyCode(src.Parcel.Agency))
                .Map(dest => dest.SubAgency,
                    src => src.Building != null ? GetAgencyName(src.Building.Agency) : GetAgencyName(src.Parcel.Agency))

                .Map(dest => dest.LandArea, src => src.Building != null ? GetLandArea(src.Building.Parcels.FirstOrDefault().Parcel) : GetLandArea(src.Parcel))
                .Map(dest => dest.ParcelId, src => src.Building != null ? src.Building.Parcels.FirstOrDefault().Parcel.GetId() : src.Parcel.GetId())
                .Inherits<BaseEntity, BaseModel>();

        }

        private float? GetLandArea(Parcel parcel)
        {
            return parcel?.LandArea;
        }

        private string GetAgencyCode(Agency agency)
        {
            return agency.Parent?.Code ?? agency.Code;
        }

        private string GetAgencyName(Agency agency)
        {
            return agency != null ? agency.Name : "";
        }

        private decimal GetBuildingAssessedValue(ICollection<BuildingEvaluation> evaluations)
        {
            var evaluation = evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Assessed);
            return evaluation?.Value ?? 0;
        }

        private decimal GetParcelAssessedValue(ICollection<ParcelEvaluation> evaluations)
        {
            var parcelEvaluation = evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Assessed);
            return parcelEvaluation?.Value ?? 0;
        }

        private decimal GetBuildingNetBookValue(ICollection<BuildingFiscal> fiscals)
        {
            var buildingFiscal = fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.NetBook);
            return buildingFiscal?.Value ?? 0;
        }

        private decimal GetBuildingMarketValue(ICollection<BuildingFiscal> fiscals)
        {
            var buildingFiscal = fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.Market);
            return buildingFiscal?.Value ?? 0;
        }

        private decimal GetParcelNetBookValue(ICollection<ParcelFiscal> fiscals)
        {
            var parcelFiscal = fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.NetBook);
            return parcelFiscal?.Value ?? 0;
        }

        private decimal GetParcelMarketValue(ICollection<ParcelFiscal> fiscals)
        {
            var parcelFiscal = fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.Market);
            return parcelFiscal?.Value ?? 0;
        }

    }
}
