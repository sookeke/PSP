using System.Collections.Generic;

namespace Pims.Ltsa.Models
{
    public class LtsaOrders
    {
        public ParcelInfoOrder ParcelInfo { get; set; }
        public IEnumerable<TitleOrder> TitleOrders { get; set; }
    }
}
