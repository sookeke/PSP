/* 
 * Title Direct Search Services
 *
 * Title Direct Search Services
 *
 * OpenAPI spec version: 4.0.1
 * 
 * Generated by: https://github.com/swagger-api/swagger-codegen.git
 */
using System;
using System.Runtime.Serialization;


namespace Pims.Ltsa.Models
{
    /// <summary>
    /// ChargeRelease
    /// </summary>
    [DataContract]
    public partial class ChargeRelease
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ChargeRelease" /> class.
        /// </summary>
        /// <param name="documentNumber">The Document bearing the application that caused the charge to be canceled on this Title..</param>
        /// <param name="documentAcceptanceDate">The acceptance date and time of the document of the charge release. .</param>
        public ChargeRelease(string documentNumber = default, DateTime? documentAcceptanceDate = default)
        {
            this.DocumentNumber = documentNumber;
            this.DocumentAcceptanceDate = documentAcceptanceDate;
        }

        /// <summary>
        /// The Document bearing the application that caused the charge to be canceled on this Title.
        /// </summary>
        /// <value>The Document bearing the application that caused the charge to be canceled on this Title.</value>
        [DataMember(Name = "documentNumber", EmitDefaultValue = false)]
        public string DocumentNumber { get; set; }

        /// <summary>
        /// The acceptance date and time of the document of the charge release. 
        /// </summary>
        /// <value>The acceptance date and time of the document of the charge release. </value>
        [DataMember(Name = "documentAcceptanceDate", EmitDefaultValue = false)]
        public DateTime? DocumentAcceptanceDate { get; set; }
    }
}
