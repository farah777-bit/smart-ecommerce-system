using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace Backend.Models
{
    public class ProductAttributeValue
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public int ProductAttributeId { get; set; }

        public string Value { get; set; } = string.Empty;

        public Product Product { get; set; } = null!;

        public ProductAttribute ProductAttribute { get; set; } = null!;
    }
}
