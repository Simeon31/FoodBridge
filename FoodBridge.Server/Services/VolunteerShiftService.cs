using AutoMapper;
using FoodBridge.Server.Data;
using FoodBridge.Server.Data.Models;
using FoodBridge.Server.DTOs.Common;
using FoodBridge.Server.DTOs.Volunteers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FoodBridge.Server.Services
{
    public interface IVolunteerShiftService
    {
        Task<PagedResultDto<VolunteerShiftDto>> GetAllShiftsAsync(VolunteerShiftFilterDto filter);
        Task<VolunteerShiftDto?> GetShiftByIdAsync(int shiftId);
 Task<VolunteerShiftDto> CreateShiftAsync(CreateVolunteerShiftDto dto, string coordinatorId);
        Task<VolunteerShiftDto?> UpdateShiftAsync(int shiftId, UpdateVolunteerShiftDto dto);
 Task<bool> DeleteShiftAsync(int shiftId);
        Task<VolunteerAssignmentDto> AssignVolunteerAsync(int shiftId, AssignVolunteerDto dto);
Task<bool> UnassignVolunteerAsync(int assignmentId);
        Task<List<VolunteerAssignmentDto>> GetShiftAssignmentsAsync(int shiftId);
   Task<bool> CheckInVolunteerAsync(int assignmentId);
        Task<bool> CheckOutVolunteerAsync(int assignmentId);
 }

    public class VolunteerShiftService : IVolunteerShiftService
{
        private readonly ApplicationDbContext _context;
   private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<VolunteerShiftService> _logger;
  private readonly IMapper _mapper;

      public VolunteerShiftService(
     ApplicationDbContext context,
  UserManager<ApplicationUser> userManager,
       ILogger<VolunteerShiftService> logger,
  IMapper mapper)
        {
       _context = context;
            _userManager = userManager;
_logger = logger;
  _mapper = mapper;
        }

    public async Task<PagedResultDto<VolunteerShiftDto>> GetAllShiftsAsync(VolunteerShiftFilterDto filter)
        {
    try
       {
 var query = _context.VolunteerShifts
        .Include(s => s.Creator)
        .Include(s => s.Assignments)
   .ThenInclude(a => a.Volunteer)
    .AsQueryable();

           // Apply filters
      if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
{
      var searchLower = filter.SearchTerm.ToLower();
 query = query.Where(s =>
   s.Title.ToLower().Contains(searchLower) ||
       (s.Description != null && s.Description.ToLower().Contains(searchLower)) ||
        s.Location.ToLower().Contains(searchLower));
      }

    if (!string.IsNullOrWhiteSpace(filter.Status))
  {
       query = query.Where(s => s.Status == filter.Status);
           }

  if (filter.StartDate.HasValue)
          {
            query = query.Where(s => s.StartTime >= filter.StartDate.Value);
 }

      if (filter.EndDate.HasValue)
{
     query = query.Where(s => s.EndTime <= filter.EndDate.Value);
  }

       if (!string.IsNullOrWhiteSpace(filter.Location))
     {
      query = query.Where(s => s.Location == filter.Location);
       }

                var totalCount = await query.CountAsync();
         var shifts = await query
       .OrderBy(s => s.StartTime)
       .Skip((filter.PageNumber - 1) * filter.PageSize)
    .Take(filter.PageSize)
       .ToListAsync();

         var shiftDtos = shifts.Select(s => MapToDto(s)).ToList();

    return new PagedResultDto<VolunteerShiftDto>
 {
        Items = shiftDtos,
   TotalCount = totalCount,
 PageNumber = filter.PageNumber,
 PageSize = filter.PageSize
      };
     }
       catch (Exception ex)
 {
    _logger.LogError(ex, "Error retrieving volunteer shifts");
        throw;
   }
        }

 public async Task<VolunteerShiftDto?> GetShiftByIdAsync(int shiftId)
        {
     try
            {
   var shift = await _context.VolunteerShifts
    .Include(s => s.Creator)
   .Include(s => s.Assignments)
            .ThenInclude(a => a.Volunteer)
       .FirstOrDefaultAsync(s => s.ShiftId == shiftId);

  return shift != null ? MapToDto(shift) : null;
         }
       catch (Exception ex)
{
  _logger.LogError(ex, "Error retrieving shift {ShiftId}", shiftId);
       throw;
            }
 }

   public async Task<VolunteerShiftDto> CreateShiftAsync(CreateVolunteerShiftDto dto, string coordinatorId)
 {
  try
{
    if (dto.EndTime <= dto.StartTime)
    {
     throw new InvalidOperationException("End time must be after start time");
    }

      var shift = new VolunteerShift
  {
   Title = dto.Title,
     Description = dto.Description,
           StartTime = dto.StartTime,
        EndTime = dto.EndTime,
             Location = dto.Location,
    RequiredVolunteers = dto.RequiredVolunteers,
      AssignedVolunteers = 0,
   Status = "Open",
  CreatedBy = coordinatorId,
  CreatedAt = DateTime.UtcNow
    };

      _context.VolunteerShifts.Add(shift);
        await _context.SaveChangesAsync();

    return await GetShiftByIdAsync(shift.ShiftId) ?? MapToDto(shift);
         }
 catch (Exception ex)
 {
_logger.LogError(ex, "Error creating volunteer shift");
    throw;
 }
  }

   public async Task<VolunteerShiftDto?> UpdateShiftAsync(int shiftId, UpdateVolunteerShiftDto dto)
        {
         try
          {
   var shift = await _context.VolunteerShifts.FindAsync(shiftId);
           if (shift == null) return null;

                if (dto.EndTime <= dto.StartTime)
            {
throw new InvalidOperationException("End time must be after start time");
        }

   shift.Title = dto.Title;
    shift.Description = dto.Description;
         shift.StartTime = dto.StartTime;
     shift.EndTime = dto.EndTime;
  shift.Location = dto.Location;
   shift.RequiredVolunteers = dto.RequiredVolunteers;
    shift.Status = dto.Status;
     shift.UpdatedAt = DateTime.UtcNow;

  await _context.SaveChangesAsync();

    return await GetShiftByIdAsync(shiftId);
        }
        catch (Exception ex)
   {
                _logger.LogError(ex, "Error updating shift {ShiftId}", shiftId);
   throw;
     }
        }

  public async Task<bool> DeleteShiftAsync(int shiftId)
 {
      try
{
   var shift = await _context.VolunteerShifts
        .Include(s => s.Assignments)
  .FirstOrDefaultAsync(s => s.ShiftId == shiftId);

  if (shift == null) return false;

    // Only allow deletion if no volunteers are assigned
      if (shift.Assignments.Any())
{
     throw new InvalidOperationException("Cannot delete shift with assigned volunteers");
       }

    _context.VolunteerShifts.Remove(shift);
           await _context.SaveChangesAsync();

      return true;
}
   catch (Exception ex)
  {
  _logger.LogError(ex, "Error deleting shift {ShiftId}", shiftId);
         throw;
 }
 }

        public async Task<VolunteerAssignmentDto> AssignVolunteerAsync(int shiftId, AssignVolunteerDto dto)
   {
     try
            {
   var shift = await _context.VolunteerShifts
 .Include(s => s.Assignments)
        .FirstOrDefaultAsync(s => s.ShiftId == shiftId);

      if (shift == null)
             {
    throw new InvalidOperationException("Shift not found");
 }

   // Check if shift is full
           if (shift.AssignedVolunteers >= shift.RequiredVolunteers)
    {
       throw new InvalidOperationException("Shift is already full");
          }

      // Check if volunteer already assigned
      var existingAssignment = shift.Assignments
      .FirstOrDefault(a => a.VolunteerId == dto.VolunteerId && a.Status != "Cancelled");

   if (existingAssignment != null)
        {
      throw new InvalidOperationException("Volunteer is already assigned to this shift");
  }

     // Verify volunteer exists and has Volunteer role
    var volunteer = await _userManager.FindByIdAsync(dto.VolunteerId);
         if (volunteer == null)
        {
      throw new InvalidOperationException("Volunteer not found");
      }

    var roles = await _userManager.GetRolesAsync(volunteer);
     if (!roles.Contains("Volunteer"))
                {
 throw new InvalidOperationException("User does not have Volunteer role");
   }

       var assignment = new VolunteerAssignment
        {
     ShiftId = shiftId,
VolunteerId = dto.VolunteerId,
       Status = "Assigned",
        AssignedAt = DateTime.UtcNow,
     Notes = dto.Notes
      };

     _context.VolunteerAssignments.Add(assignment);
    shift.AssignedVolunteers++;

                // Update shift status if full
 if (shift.AssignedVolunteers >= shift.RequiredVolunteers)
     {
        shift.Status = "Filled";
 }

     await _context.SaveChangesAsync();

       // Return the assignment with volunteer details
 var assignmentWithDetails = await _context.VolunteerAssignments
    .Include(a => a.Volunteer)
     .FirstOrDefaultAsync(a => a.AssignmentId == assignment.AssignmentId);

         return MapAssignmentToDto(assignmentWithDetails!);
     }
     catch (Exception ex)
            {
    _logger.LogError(ex, "Error assigning volunteer to shift {ShiftId}", shiftId);
    throw;
            }
 }

     public async Task<bool> UnassignVolunteerAsync(int assignmentId)
        {
  try
            {
  var assignment = await _context.VolunteerAssignments
    .Include(a => a.Shift)
     .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

   if (assignment == null) return false;

        assignment.Status = "Cancelled";
    assignment.Shift.AssignedVolunteers--;

     // Update shift status
         if (assignment.Shift.Status == "Filled" && 
       assignment.Shift.AssignedVolunteers < assignment.Shift.RequiredVolunteers)
                {
      assignment.Shift.Status = "Open";
     }

       await _context.SaveChangesAsync();

      return true;
   }
        catch (Exception ex)
       {
        _logger.LogError(ex, "Error unassigning volunteer {AssignmentId}", assignmentId);
         throw;
         }
  }

    public async Task<List<VolunteerAssignmentDto>> GetShiftAssignmentsAsync(int shiftId)
{
   try
       {
      var assignments = await _context.VolunteerAssignments
      .Include(a => a.Volunteer)
     .Where(a => a.ShiftId == shiftId)
       .ToListAsync();

         return assignments.Select(a => MapAssignmentToDto(a)).ToList();
            }
  catch (Exception ex)
         {
        _logger.LogError(ex, "Error retrieving assignments for shift {ShiftId}", shiftId);
       throw;
            }
  }

 public async Task<bool> CheckInVolunteerAsync(int assignmentId)
        {
   try
{
     var assignment = await _context.VolunteerAssignments.FindAsync(assignmentId);
           if (assignment == null) return false;

      assignment.CheckInTime = DateTime.UtcNow;
     assignment.Status = "Confirmed";

    await _context.SaveChangesAsync();

   return true;
   }
         catch (Exception ex)
  {
      _logger.LogError(ex, "Error checking in volunteer {AssignmentId}", assignmentId);
            throw;
 }
 }

        public async Task<bool> CheckOutVolunteerAsync(int assignmentId)
 {
         try
{
        var assignment = await _context.VolunteerAssignments.FindAsync(assignmentId);
                if (assignment == null) return false;

      assignment.CheckOutTime = DateTime.UtcNow;
     assignment.Status = "Completed";

       await _context.SaveChangesAsync();

         return true;
  }
   catch (Exception ex)
 {
    _logger.LogError(ex, "Error checking out volunteer {AssignmentId}", assignmentId);
         throw;
            }
  }

        private VolunteerShiftDto MapToDto(VolunteerShift shift)
   {
     return new VolunteerShiftDto
    {
      ShiftId = shift.ShiftId,
       Title = shift.Title,
         Description = shift.Description,
    StartTime = shift.StartTime,
           EndTime = shift.EndTime,
       Location = shift.Location,
     RequiredVolunteers = shift.RequiredVolunteers,
  AssignedVolunteers = shift.AssignedVolunteers,
       Status = shift.Status,
CreatedBy = shift.CreatedBy,
        CreatedByName = shift.Creator != null ? $"{shift.Creator.FirstName} {shift.Creator.LastName}" : string.Empty,
     CreatedAt = shift.CreatedAt,
     UpdatedAt = shift.UpdatedAt,
     Assignments = shift.Assignments?.Select(a => MapAssignmentToDto(a)).ToList() ?? new List<VolunteerAssignmentDto>()
       };
        }

        private VolunteerAssignmentDto MapAssignmentToDto(VolunteerAssignment assignment)
    {
     return new VolunteerAssignmentDto
         {
  AssignmentId = assignment.AssignmentId,
    ShiftId = assignment.ShiftId,
         VolunteerId = assignment.VolunteerId,
   VolunteerName = assignment.Volunteer != null ? $"{assignment.Volunteer.FirstName} {assignment.Volunteer.LastName}" : string.Empty,
   VolunteerEmail = assignment.Volunteer?.Email ?? string.Empty,
                Status = assignment.Status,
   AssignedAt = assignment.AssignedAt,
    CheckInTime = assignment.CheckInTime,
   CheckOutTime = assignment.CheckOutTime,
       Notes = assignment.Notes
      };
   }
    }
}
